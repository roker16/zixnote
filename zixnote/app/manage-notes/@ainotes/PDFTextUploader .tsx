"use client";
import React, { useRef, useState } from "react";
import {
  Button,
  Textarea,
  Badge,
  Modal,
  TextInput,
  Group,
  Text,
} from "@mantine/core";
import { createClient } from "@/utils/supabase/client";
import {
  useDeleteMutation,
  useQuery,
} from "@supabase-cache-helpers/postgrest-swr";
import { IconCheck, IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { PDFDocument } from "pdf-lib";

interface PDFTextUploaderProps {
  indexId: number;
  profileId: string;
}

const MAX_TOTAL_FILE_SIZE_MB = 25;
const MAX_PART_FILE_SIZE_MB = 4;
const WORD_LIMIT = 60000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const SMALL_FILE_THRESHOLD_MB = 1; // Threshold for attempting local copy

export const PDFTextUploader = ({
  indexId,
  profileId,
}: PDFTextUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>("");

  const supabase = createClient();

  const { data: existingResources, mutate } = useQuery(
    supabase
      .from("pdf_extracted_texts")
      .select("id, file_name, description")
      .eq("index_id", indexId)
      .eq("uploaded_by", profileId)
      .order("uploaded_at", { ascending: false }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: true,
    }
  );

  const { trigger: deleteResource } = useDeleteMutation(
    supabase.from("pdf_extracted_texts"),
    ["id"],
    null,
    {
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "Resource deleted successfully",
          color: "green",
          icon: <IconCheck size={18} />,
          position: "top-center",
          autoClose: 3000,
        });
      },
      onError: (error) => {
        console.error("Delete error:", error);
        notifications.show({
          title: "Error",
          message: "Failed to delete resource",
          color: "red",
          icon: <IconX size={18} />,
          position: "top-center",
          autoClose: 3000,
        });
      },
    }
  );

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  };

  const isFileAccessible = async (file: File): Promise<boolean> => {
    try {
      const testReader = new FileReader();
      await new Promise((resolve, reject) => {
        testReader.onload = resolve;
        testReader.onerror = reject;
        testReader.readAsArrayBuffer(
          file.slice(0, Math.min(file.size, 2 * 1024 * 1024))
        ); // Read up to 2MB
      });
      return true;
    } catch {
      return false;
    }
  };

  const isGoogleDriveFile = (file: File): boolean => {
    const cloudPatterns = [
      "content://com.google.android.apps.docs.storage",
      "content://com.google.android.apps.photos",
      /googledrive/i,
      /drive\.google\.com/i,
      /content:\/\//i, // Broader check for content URIs on Android
    ];
    const isAndroid = /Android/i.test(navigator.userAgent);
    return (
      isAndroid &&
      cloudPatterns.some((pattern) =>
        typeof pattern === "string"
          ? file.name.includes(pattern) ||
            (file as any).webkitRelativePath?.includes(pattern)
          : pattern.test(file.name) ||
            pattern.test((file as any).webkitRelativePath || "")
      )
    );
  };

  const createLocalFileCopy = async (file: File): Promise<File> => {
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const blob = new Blob([arrayBuffer], { type: file.type });
      return new File([blob], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
    } catch (err) {
      console.error("Failed to create local file copy:", err);
      throw new Error("Unable to process Google Drive file");
    }
  };

  const fetchWithRetry = async (
    url: string,
    options: RequestInit,
    file: File,
    retries: number
  ): Promise<Response> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        if (!(await isFileAccessible(file))) {
          throw new Error("File is not accessible");
        }
        const response = await fetch(url, {
          ...options,
          signal: AbortSignal.timeout(60000), // 60s timeout
        });
        if (!response.ok) {
          throw new Error(
            `HTTP error ${response.status}: ${response.statusText}`
          );
        }
        return response;
      } catch (error) {
        if (attempt === retries) throw error;
        console.warn(
          `Fetch attempt ${attempt} failed for file ${file.name} (${file.size} bytes), retrying...`,
          error
        );
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
    throw new Error("Max retries reached");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    setErrorMsg("");
    setExtractedText("");
    setFileName(null);
    setProcessingStatus("");

    console.log("File selected:", file?.name, file?.type, file?.size);

    if (!file || file.type !== "application/pdf") {
      setErrorMsg("❌ Please upload a valid PDF file.");
      console.error("Invalid file type:", file?.type);
      return;
    }

    let uploadFile = file;

    if (isGoogleDriveFile(file)) {
      if (file.size <= SMALL_FILE_THRESHOLD_MB * 1024 * 1024) {
        setProcessingStatus("Copying small Google Drive file locally...");
        try {
          uploadFile = await createLocalFileCopy(file);
          console.log("Local copy created:", uploadFile.name, uploadFile.size);
        } catch (err) {
          console.error("Google Drive copy error:", err);
          setErrorMsg(
            "⚠️ Failed to process small Google Drive file. Please download the file to your device (e.g., Downloads folder) and try again."
          );
          setProcessingStatus("");
          return;
        }
      } else {
        setErrorMsg(
          "⚠️ Google Drive files may not work directly. Please download the file to your device (e.g., Downloads folder) and try uploading again."
        );
        setProcessingStatus("");
        return;
      }
    }

    if (!(await isFileAccessible(uploadFile))) {
      setErrorMsg(
        "❌ File is not accessible. Please download it locally and try again."
      );
      setProcessingStatus("");
      return;
    }

    const isAndroid = /Android/i.test(navigator.userAgent);
    const MAX_FILE_SIZE_MB = isAndroid ? 15 : MAX_TOTAL_FILE_SIZE_MB;
    const totalMaxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (uploadFile.size > totalMaxBytes) {
      setErrorMsg(`❌ File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }

    const maxPartBytes = MAX_PART_FILE_SIZE_MB * 1024 * 1024;
    setUploading(true);

    try {
      const baseFileName = uploadFile.name.replace(/\.pdf$/i, "");
      const arrayBuffer = await readFileAsArrayBuffer(uploadFile);
      const fullPdf = await PDFDocument.load(arrayBuffer);
      const totalPages = fullPdf.getPageCount();

      console.log(
        `Original size: ${(uploadFile.size / 1024 / 1024).toFixed(2)}MB`
      );
      console.log(`Total pages: ${totalPages}`);

      if (uploadFile.size <= maxPartBytes) {
        setProcessingStatus("Processing file...");
        const formData = new FormData();
        formData.append("file", uploadFile);
        const res = await fetchWithRetry(
          "/api/extractpdftotext",
          {
            method: "POST",
            body: formData,
          },
          uploadFile,
          MAX_RETRIES
        );
        console.log("API response status:", res.status, res.statusText);
        const { text, error } = await res.json();
        console.log("API response data:", { text, error });

        if (error || !text) {
          setErrorMsg("❌ Failed to extract text from file");
          setUploading(false);
          setProcessingStatus("");
          return;
        }

        const wordCount = text.trim().split(/\s+/).length;
        if (wordCount > WORD_LIMIT) {
          setErrorMsg(`❌ Extracted text exceeds ${WORD_LIMIT} word limit.`);
          setUploading(false);
          return;
        }

        const { error: dbError } = await supabase
          .from("pdf_extracted_texts")
          .insert({
            index_id: indexId,
            uploaded_by: profileId,
            file_name: uploadFile.name,
            extracted_text: text,
            description: description || null,
          });

        if (dbError) {
          console.error("Supabase error:", dbError);
          setErrorMsg("❌ Failed to save to database.");
          setProcessingStatus("");
        } else {
          notifications.show({
            title: `Saved: ${uploadFile.name}`,
            message: "Text saved successfully",
            color: "green",
            icon: <IconCheck size={18} />,
            position: "top-center",
            autoClose: 3000,
          });
        }

        await mutate();
        setUploading(false);
        setProcessingStatus("");
        return;
      }

      setProcessingStatus("Splitting PDF...");
      const parts: { pages: number[]; pdfBytes: Uint8Array }[] = [];
      let currentPart = await PDFDocument.create();
      let currentPartPages: number[] = [];
      let currentPartSize = 0;

      const emptyPdf = await PDFDocument.create();
      const overheadBytes = (await emptyPdf.save()).byteLength;
      const avgPageSize = (uploadFile.size - overheadBytes) / totalPages;

      for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
        const [copiedPage] = await currentPart.copyPages(fullPdf, [pageIndex]);
        currentPart.addPage(copiedPage);
        currentPartPages.push(pageIndex);

        if (
          currentPartPages.length % 2 === 0 ||
          (currentPartSize > maxPartBytes * 0.7 && currentPartPages.length > 1)
        ) {
          const pdfBytes = await currentPart.save();
          currentPartSize = pdfBytes.byteLength;

          if (currentPartSize > maxPartBytes) {
            currentPart.removePage(currentPart.getPageCount() - 1);
            const finalBytes = await currentPart.save();
            parts.push({
              pages: [...currentPartPages.slice(0, -1)],
              pdfBytes: finalBytes,
            });

            currentPart = await PDFDocument.create();
            const [newPage] = await currentPart.copyPages(fullPdf, [pageIndex]);
            currentPart.addPage(newPage);
            currentPartPages = [pageIndex];
            currentPartSize = (await currentPart.save()).byteLength;
          }
        } else {
          currentPartSize =
            overheadBytes + avgPageSize * currentPartPages.length;
        }
      }

      if (currentPart.getPageCount() > 0) {
        const pdfBytes = await currentPart.save();
        parts.push({
          pages: currentPartPages,
          pdfBytes: pdfBytes,
        });
      }

      fullPdf.removePage(0);

      console.log(
        `Created ${parts.length} parts (total ${(
          parts.reduce((sum, part) => sum + part.pdfBytes.byteLength, 0) /
          1024 /
          1024
        ).toFixed(2)}MB)`
      );

      for (let partIndex = 0; partIndex < parts.length; partIndex++) {
        const part = parts[partIndex];
        setProcessingStatus(
          `Processing part ${partIndex + 1}/${parts.length}...`
        );

        const pdfUint8Array = new Uint8Array(part.pdfBytes);
        const blob = new Blob([pdfUint8Array], { type: "application/pdf" });
        const partFile = new File(
          [blob],
          `${baseFileName}-part${partIndex + 1}.pdf`,
          { type: "application/pdf" }
        );

        const formData = new FormData();
        formData.append("file", partFile);

        const res = await fetchWithRetry(
          "/api/extractpdftotext",
          {
            method: "POST",
            body: formData,
          },
          partFile,
          MAX_RETRIES
        );
        console.log("API response status:", res.status, res.statusText);
        const { text, error } = await res.json();
        console.log("API response data:", { text, error });

        if (error || !text) {
          setErrorMsg(`❌ Failed to extract text from part ${partIndex + 1}`);
          continue;
        }

        const wordCount = text.trim().split(/\s+/).length;
        if (wordCount > WORD_LIMIT) {
          setErrorMsg(
            `❌ Part ${partIndex + 1} exceeds ${WORD_LIMIT} word limit.`
          );
          continue;
        }

        const { error: dbError } = await supabase
          .from("pdf_extracted_texts")
          .insert({
            index_id: indexId,
            uploaded_by: profileId,
            file_name: `${baseFileName}-part${partIndex + 1}.pdf`,
            extracted_text: text,
            description: description || null,
          });

        if (dbError) {
          console.error("Supabase error:", dbError);
          setErrorMsg(`❌ Failed to save part ${partIndex + 1} to database.`);
        } else {
          notifications.show({
            title: `Saved: ${baseFileName}-part${partIndex + 1}`,
            message: "Text saved successfully",
            color: "green",
            icon: <IconCheck size={18} />,
            position: "top-center",
            autoClose: 3000,
          });
        }
      }

      await mutate();
    } catch (err) {
      console.error("PDF processing error:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes("ERR_UPLOAD_FILE_CHANGED")) {
        setErrorMsg(
          "❌ File changed during upload. Please download the file to your device (e.g., Downloads folder) and try again."
        );
      } else {
        setErrorMsg(
          `❌ Unexpected error while processing PDF: ${errorMessage}`
        );
      }
    } finally {
      setUploading(false);
      setProcessingStatus("");
    }
  };

  const handleSave = async () => {
    if (!extractedText || !fileName || !profileId || !indexId) {
      setErrorMsg("❌ Missing required data.");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    const { error } = await supabase.from("pdf_extracted_texts").insert({
      index_id: indexId,
      uploaded_by: profileId,
      file_name: fileName,
      extracted_text: extractedText,
      description: description || null,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      setErrorMsg("❌ Failed to save to database.");
    } else {
      setModalOpen(false);
      setExtractedText("");
      setFileName(null);
      setDescription("");
      notifications.show({
        title: "Success",
        message: "Text saved successfully",
        color: "green",
        icon: <IconCheck size={18} />,
        position: "top-center",
        autoClose: 3000,
      });
      await mutate();
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!resourceToDelete) return;

    setDeletingId(resourceToDelete);

    await deleteResource({ id: resourceToDelete, uploaded_by: profileId });

    setDeletingId(null);
    setDeleteModalOpen(false);
    setResourceToDelete(null);
    await mutate();
  };

  const openDeleteModal = (id: number) => {
    setResourceToDelete(id);
    setDeleteModalOpen(true);
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white max-w-2xl relative">
      <Group gap="xs">
        <Button
          component="label"
          disabled={uploading}
          variant="light"
          size="xs"
          leftSection={<IconUpload />}
        >
          UPLOAD PDF RESOURCE FOR NOTES MAKING
          <input
            type="file"
            ref={fileInputRef}
            accept="application/pdf"
            hidden
            onChange={handleFileUpload}
          />
        </Button>

        {fileName && (
          <Badge color="green" variant="light">
            ✅ {fileName}
          </Badge>
        )}

        {uploading && (
          <Badge color="yellow" variant="light" className="animate-pulse">
            ⏳ {processingStatus}
          </Badge>
        )}
      </Group>

      {errorMsg && (
        <div className="text-red-600 mt-2 text-sm border border-red-300 bg-red-50 p-2 rounded">
          {errorMsg}
        </div>
      )}

      <Text size="sm" color="dimmed" mt={4}>
        Note: For Google Drive files, download the PDF to your device (e.g.,
        Downloads folder) before uploading to avoid errors.
      </Text>

      {existingResources && existingResources.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">📄 Already Uploaded PDFs</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            {existingResources.map((res) => (
              <li
                key={res.id}
                className="flex items-center justify-between px-2 py-0"
              >
                <div className="flex items-center gap-2 truncate">
                  <IconTrash
                    size={16}
                    className={`cursor-pointer ${
                      deletingId === res.id ? "opacity-50 animate-pulse" : ""
                    }`}
                    onClick={() => openDeleteModal(res.id)}
                  />
                  <span className="italic font-semibold truncate">
                    {res.file_name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Review Extracted Text"
        size="lg"
        centered
      >
        <Textarea
          label="Extracted Text"
          minRows={10}
          maxRows={30}
          value={extractedText}
          onChange={(e) => setExtractedText(e.target.value)}
        />

        <TextInput
          label="Optional Description"
          placeholder="e.g. Summary of Case Study PDF"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-4"
        />

        <Group className="mt-4">
          <Button variant="light" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={saving}>
            Save to Database
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        centered
      >
        <Text>Are you sure you want to delete this resource?</Text>
        <Group className="mt-4">
          <Button variant="light" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDelete}
            loading={deletingId !== null}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
};
