"use client";

import React, { useRef, useState } from "react";
import {
  Textarea,
  Button,
  Badge,
  Modal,
  Text,
  Group,
  ScrollArea,
} from "@mantine/core";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

interface MessageInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    payload: { input: string; extractedText: string }
  ) => void;
  isLoading: boolean;
  indexId: number;
  profileId: string | undefined;
}

const WORD_LIMIT = 30000;

const MessageInputComponent = ({
  input,
  setInput,
  handleSubmit,
  isLoading,
  indexId,
  profileId,
}: MessageInputProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [viewTextModalOpen, setViewTextModalOpen] = useState<boolean>(false);
  const [selectPdfModalOpen, setSelectPdfModalOpen] = useState<boolean>(false);

  const supabase = createClient();

  // Fetch only metadata (exclude extracted_text)
  const { data: availablePdfs } = useQuery(
    supabase
      .from("pdf_extracted_texts")
      .select("id, file_name, description")
      .eq("index_id", indexId)
      .eq("uploaded_by", profileId!)
      .order("uploaded_at", { ascending: false }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: true,
    }
  );

  const handlePdfSelect = async (pdf: {
    id: number;
    file_name: string;
    description: string | null;
  }) => {
    setErrorMsg("");
    setFileName(null);
    setExtractedText("");

    // Fetch extracted_text for the selected PDF
    const { data, error } = await supabase
      .from("pdf_extracted_texts")
      .select("extracted_text")
      .eq("id", pdf.id)
      .single();

    if (error || !data) {
      setErrorMsg("❌ Failed to load PDF content.");
      notifications.show({
        title: "Error",
        message: "Failed to load PDF content.",
        color: "red",
        icon: <IconX size={18} />,
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const wordCount = data.extracted_text.trim().split(/\s+/).length;
    if (wordCount > WORD_LIMIT) {
      setErrorMsg(`❌ Selected PDF too long: ${wordCount} words.`);
      notifications.show({
        title: "Error",
        message: `Selected PDF too long: ${wordCount} words.`,
        color: "red",
        icon: <IconX size={18} />,
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setFileName(pdf.file_name);
    setExtractedText(data.extracted_text);
    setSelectPdfModalOpen(false);
    notifications.show({
      title: "Success",
      message: `Loaded PDF: ${pdf.file_name}`,
      color: "green",
      icon: <IconCheck size={18} />,
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e, {
      input,
      extractedText,
    });
    setInput("");
  };

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-2 p-2 border rounded-md shadow-sm bg-white"
      >
        {fileName && (
          <div className="pl-1">
            <Badge color="green" variant="light" className="text-xs">
              ✅ Loaded: {fileName}
            </Badge>
          </div>
        )}

        {errorMsg && (
          <div className="text-red-600 text-sm mt-1 px-2 py-1 border border-red-200 bg-red-50 rounded">
            {errorMsg}
          </div>
        )}

        <div className="flex gap-2 items-end">
          <Textarea
            data-autofocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter instructions for AI..."
            disabled={isLoading}
            className="flex-1"
            minRows={2}
            maxRows={6}
          />

          <div className="flex flex-col gap-1">
            <Button
              variant="light"
              size="xs"
              className="w-[90px]"
              disabled={isLoading}
              onClick={() => setSelectPdfModalOpen(true)}
            >
              Select PDF
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              size="xs"
              className="bg-blue-500 hover:bg-blue-600 text-white w-[90px]"
            >
              {isLoading ? "..." : "Send"}
            </Button>
          </div>
        </div>

        {extractedText && (
          <Button
            variant="subtle"
            size="xs"
            className="text-blue-600 underline self-start mt-2"
            onClick={() => setViewTextModalOpen(true)}
          >
            📄 View Extracted Text
          </Button>
        )}
      </form>

      <Modal
        opened={selectPdfModalOpen}
        onClose={() => setSelectPdfModalOpen(false)}
        title="Select PDF"
        size="lg"
        centered
      >
        <ScrollArea h={300}>
          {availablePdfs && availablePdfs.length > 0 ? (
            <div className="space-y-2">
              {availablePdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100"
                  onClick={() => handlePdfSelect(pdf)}
                >
                  <div>
                    <Text size="sm" fw={500}>
                      {pdf.file_name}
                    </Text>
                    {pdf.description && (
                      <Text size="xs" c="dimmed">
                        {pdf.description}
                      </Text>
                    )}
                  </div>
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={() => handlePdfSelect(pdf)}
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <Text c="dimmed" size="sm" ta="center">
              No PDFs available
            </Text>
          )}
        </ScrollArea>
      </Modal>

      <Modal
        opened={viewTextModalOpen}
        onClose={() => setViewTextModalOpen(false)}
        title="Extracted PDF Text"
        size="lg"
        centered
      >
        <div className="whitespace-pre-wrap text-sm max-h-[70vh] overflow-y-auto">
          {extractedText}
        </div>
      </Modal>
    </>
  );
};

MessageInputComponent.displayName = "MessageInputComponent";
export const MessageInput = React.memo(MessageInputComponent);
