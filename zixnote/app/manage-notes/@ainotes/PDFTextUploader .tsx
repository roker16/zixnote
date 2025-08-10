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
  ScrollArea,
  Box,
  Loader,
  Title,
} from "@mantine/core";
import { createClient } from "@/utils/supabase/client";
import {
  useDeleteMutation,
  useQuery,
} from "@supabase-cache-helpers/postgrest-swr";
import {
  IconCheck,
  IconTrash,
  IconUpload,
  IconX,
  IconEye,
  IconPencil,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { PDFDocument } from "pdf-lib";

interface PDFTextUploaderProps {
  indexId: number;
  profileId: string;
}

const MAX_TOTAL_FILE_SIZE_MB = 25;
const MAX_PART_FILE_SIZE_MB = 4;
const WORD_LIMIT = 60000;

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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [textModalOpen, setTextModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [processingStatus, setProcessingStatus] = useState("");
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(
    null
  );
  const [viewedText, setViewedText] = useState("");
  const [isLoadingText, setIsLoadingText] = useState(false);
  // New states for rename functionality
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [resourceToRename, setResourceToRename] = useState<number | null>(null);
  const [newFileName, setNewFileName] = useState("");
  const [renamingId, setRenamingId] = useState<number | null>(null);

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

    const totalMaxBytes = MAX_TOTAL_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > totalMaxBytes) {
      setErrorMsg(`❌ File size exceeds ${MAX_TOTAL_FILE_SIZE_MB}MB limit.`);
      return;
    }

    const maxPartBytes = MAX_PART_FILE_SIZE_MB * 1024 * 1024;
    setUploading(true);

    try {
      const baseFileName = file.name.replace(/\.pdf$/i, "");
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const fullPdf = await PDFDocument.load(arrayBuffer);
      const totalPages = fullPdf.getPageCount();

      console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Total pages: ${totalPages}`);

      if (file.size <= maxPartBytes) {
        setProcessingStatus("Processing file...");
        const pdfBytes = await fullPdf.save();
        const pdfUint8Array = new Uint8Array(pdfBytes);
        const blob = new Blob([pdfUint8Array], { type: "application/pdf" });
        const uploadFile = new File([blob], file.name, {
          type: "application/pdf",
        });

        const formData = new FormData();
        formData.append("file", uploadFile);
        const res = await fetch("/api/extractpdftotext", {
          method: "POST",
          body: formData,
        });
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
      const avgPageSize = (file.size - overheadBytes) / totalPages;

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

        const res = await fetch("/api/extractpdftotext", {
          method: "POST",
          body: formData,
        });
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
      setErrorMsg(
        "❌ Failed to process PDF. Please try again or use a different file."
      );
    } finally {
      setUploading(false);
      setProcessingStatus("");
    }
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

  const handleViewText = async (id: number) => {
    setSelectedResourceId(id);
    setViewedText("");
    setTextModalOpen(true);
    setIsLoadingText(true);

    try {
      const { data, error } = await supabase
        .from("pdf_extracted_texts")
        .select("extracted_text")
        .eq("id", id)
        .eq("uploaded_by", profileId)
        .single();

      if (error || !data) {
        console.error("Supabase fetch error:", error);
        setErrorMsg("❌ Failed to fetch text.");
        setSelectedResourceId(null);
        setTextModalOpen(false);
        setIsLoadingText(false);
        return;
      }

      setViewedText(data.extracted_text);
      setIsLoadingText(false);
    } catch (err) {
      console.error("Text fetch error:", err);
      setErrorMsg("❌ Failed to fetch text.");
      setSelectedResourceId(null);
      setTextModalOpen(false);
      setIsLoadingText(false);
    }
  };

  const handleRename = async () => {
    if (!resourceToRename || !newFileName.trim()) {
      setErrorMsg("❌ Please enter a valid file name.");
      return;
    }

    setRenamingId(resourceToRename);
    setErrorMsg("");

    const finalFileName = newFileName.trim().endsWith(".pdf")
      ? newFileName.trim()
      : `${newFileName.trim()}.pdf`;

    try {
      const { error } = await supabase
        .from("pdf_extracted_texts")
        .update({ file_name: finalFileName })
        .eq("id", resourceToRename)
        .eq("uploaded_by", profileId);

      if (error) {
        console.error("Supabase update error:", error);
        setErrorMsg("❌ Failed to rename file.");
      } else {
        notifications.show({
          title: "Success",
          message: "File renamed successfully",
          color: "green",
          icon: <IconCheck size={18} />,
          position: "top-center",
          autoClose: 3000,
        });
        setRenameModalOpen(false);
        setNewFileName("");
        setResourceToRename(null);
        await mutate();
      }
    } catch (err) {
      console.error("Rename error:", err);
      setErrorMsg("❌ Failed to rename file.");
    } finally {
      setRenamingId(null);
    }
  };

  const openDeleteModal = (id: number) => {
    setResourceToDelete(id);
    setDeleteModalOpen(true);
  };

  const openRenameModal = (id: number, currentName: string) => {
    setResourceToRename(id);
    setNewFileName(currentName.replace(/\.pdf$/i, ""));
    setRenameModalOpen(true);
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white max-w-2xl relative">
      <Group gap="xs">
        <Button
          component="label"
          disabled={uploading}
          variant="filled"
          size="sm"
          leftSection={<IconUpload size={14} />}
        >
          Upload PDF for Notes
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

      {existingResources && existingResources.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-3 tracking-normal border-b-2 border-gray-300 pb-1">
            Uploaded Resources
          </h4>
          <ul className="space-y-1 text-sm text-gray-700">
            {existingResources.map((res) => (
              <li
                key={res.id}
                className="flex items-center justify-between px-2 py-1"
              >
                <div className="flex items-center gap-2 w-full">
                  <IconEye
                    size={18}
                    className="cursor-pointer flex-shrink-0"
                    onClick={() => handleViewText(res.id)}
                  />
                  <IconPencil
                    size={18}
                    className="cursor-pointer flex-shrink-0"
                    onClick={() => openRenameModal(res.id, res.file_name)}
                  />
                  <IconTrash
                    size={18}
                    className="cursor-pointer flex-shrink-0"
                    onClick={() => openDeleteModal(res.id)}
                  />
                  <span
                    className="italic font-semibold truncate"
                    style={{ maxWidth: "calc(100% - 80px)" }} // Adjusted for extra icon
                  >
                    {res.file_name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

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

      <Modal
        opened={textModalOpen}
        onClose={() => {
          setTextModalOpen(false);
          setSelectedResourceId(null);
          setViewedText("");
        }}
        size="auto"
        title={<div className="font-bold text-xl">Extracted Text</div>}
      >
        <ScrollArea scrollbarSize={8} w={600} scrollbars="y">
          <Box w={600}>
            {isLoadingText ? (
              <div className="flex justify-center items-center py-32">
                <Loader size="lg" color="gray" />
              </div>
            ) : (
              viewedText
            )}
          </Box>
        </ScrollArea>
        <Group className="mt-4">
          <Button
            variant="light"
            onClick={() => {
              setTextModalOpen(false);
              setSelectedResourceId(null);
              setViewedText("");
            }}
          >
            Close
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={renameModalOpen}
        onClose={() => {
          setRenameModalOpen(false);
          setResourceToRename(null);
          setNewFileName("");
        }}
        title="Rename PDF"
        centered
      >
        <TextInput
          label="New File Name"
          placeholder="Enter new file name"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          className="mb-4"
        />
        <Group className="mt-4">
          <Button
            variant="light"
            onClick={() => {
              setRenameModalOpen(false);
              setResourceToRename(null);
              setNewFileName("");
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleRename} loading={renamingId !== null}>
            Rename
          </Button>
        </Group>
      </Modal>
    </div>
  );
};
