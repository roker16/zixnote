"use client";

import React, { useRef, useState, useEffect } from "react";
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
import { IconCheck, IconUpload, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

interface PDFTextUploaderProps {
  indexId: number;
  profileId: string; // Supabase profile UUID
}

const MAX_FILE_SIZE_MB = 25;
const WORD_LIMIT = 30000;

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

  const { trigger: deleteResource, isMutating: deleting } = useDeleteMutation(
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
        mutate();
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    setErrorMsg("");
    setExtractedText("");
    setFileName(null);

    if (!file || file.type !== "application/pdf") {
      setErrorMsg("❌ Please upload a valid PDF file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMsg(
        `❌ File too large: ${(file.size / (1024 * 1024)).toFixed(2)} MB.`
      );
      return;
    }

    setUploading(true);
    try {
      // ✅ FIX: Read into memory to avoid file being revoked mid-upload
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: file.type });
      const safeFile = new File([blob], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });

      const formData = new FormData();
      formData.append("file", safeFile); // ✅ Use cloned file here

      const res = await fetch("/api/extractpdftotext", {
        method: "POST",
        body: formData,
      });

      const { text, error } = await res.json();

      if (error || !text) {
        setErrorMsg("❌ Failed to extract text from PDF.");
        return;
      }

      const wordCount = text.trim().split(/\s+/).length;
      if (wordCount > WORD_LIMIT) {
        setErrorMsg(`❌ Extracted text exceeds ${WORD_LIMIT} word limit.`);
        return;
      }

      setExtractedText(text);
      setFileName(file.name);
      setModalOpen(true);
    } catch (err) {
      console.error("PDF extraction error:", err);
      setErrorMsg("❌ Unexpected error while extracting PDF.");
    } finally {
      setUploading(false);
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

    await deleteResource({ id: resourceToDelete, uploaded_by: profileId });
    setDeleteModalOpen(false);
    setResourceToDelete(null);
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
            ⏳ Extracting...
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
          <h4 className="font-medium mb-2">📄 Already Uploaded PDFs</h4>
          <ul className="space-y-2 text-sm text-gray-800">
            {existingResources.map((res) => (
              <li
                key={res.id}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
              >
                <div>
                  <div className="font-semibold">{res.file_name}</div>
                  {res.description && (
                    <div className="text-gray-600 text-xs">
                      {res.description}
                    </div>
                  )}
                </div>
                <Button
                  size="xs"
                  color="red"
                  loading={deleting}
                  onClick={() => openDeleteModal(res.id)}
                >
                  Delete
                </Button>
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
          <Button color="red" onClick={handleDelete} loading={deleting}>
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
};
