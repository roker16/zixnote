"use client";

import React, { useRef, useState } from "react";
import { Textarea, Button, Badge } from "@mantine/core";
import { extractTextFromPDF } from "@/utils/ai/extractTextFromPDF";

interface MessageInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const WORD_LIMIT = 10000;
const MAX_FILE_SIZE_MB = 5;
const MessageInputComponent = ({
  input,
  setInput,
  handleSubmit,
  isLoading,
}: MessageInputProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== "application/pdf") return;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(
        `❌ File too large: ${(file.size / (1024 * 1024)).toFixed(
          2
        )} MB. Max allowed is ${MAX_FILE_SIZE_MB} MB.`
      );
      return;
    }
    try {
      const text = await extractTextFromPDF(file);
      const wordCount = text.trim().split(/\s+/).length;

      if (wordCount > WORD_LIMIT) {
        alert(
          `❌ PDF too long: ${wordCount} words. Limit is ${WORD_LIMIT} words.`
        );
        return;
      }

      setInput(`Summarise the following:\n\n${text}`);
      setFileName(file.name);
    } catch (err) {
      alert(
        "Failed to extract text from PDF. It may be too large or corrupted."
      );
      console.error("PDF parsing error:", err);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 p-2 border rounded-md shadow-sm bg-white"
    >
      {fileName && (
        <div className="pl-1">
          <Badge color="green" variant="light" className="text-xs">
            ✅ Loaded: {fileName}
          </Badge>
        </div>
      )}

      <div className="flex gap-2 items-end">
        <Textarea
          data-autofocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something or upload PDF..."
          disabled={isLoading}
          className="flex-1"
          minRows={2}
          maxRows={6}
        />

        <div className="flex flex-col gap-1">
          <Button
            component="label"
            variant="light"
            size="xs"
            className="w-[90px]"
          >
            Upload PDF
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              hidden
            />
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
    </form>
  );
};

MessageInputComponent.displayName = "MessageInputComponent";

export const MessageInput = React.memo(MessageInputComponent);
