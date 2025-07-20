"use client";

import React, { useRef, useState } from "react";
import { Textarea, Button, Badge, Modal } from "@mantine/core";

interface MessageInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    payload: { input: string; extractedText: string }
  ) => void;
  isLoading: boolean;
}

const WORD_LIMIT = 30000;
const MAX_FILE_SIZE_MB = 25;

const MessageInputComponent = ({
  input,
  setInput,
  handleSubmit,
  isLoading,
}: MessageInputProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [pdfUploading, setPdfUploading] = useState<boolean>(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  // const handleFileUpload = async (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = event.target.files?.[0];
  //   event.target.value = "";
  //   setErrorMsg("");
  //   setPdfUploading(true);

  //   if (!file || file.type !== "application/pdf") {
  //     setPdfUploading(false);
  //     return;
  //   }

  //   if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
  //     setErrorMsg(
  //       `❌ File too large: ${(file.size / (1024 * 1024)).toFixed(2)} MB.`
  //     );
  //     setPdfUploading(false);
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     const res = await fetch("/api/extractpdftotext", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const { text, error } = await res.json();

  //     if (error) {
  //       setErrorMsg("❌ Failed to extract PDF.");
  //       return;
  //     }

  //     const wordCount = text.trim().split(/\s+/).length;
  //     if (wordCount > WORD_LIMIT) {
  //       setErrorMsg(`❌ PDF too long: ${wordCount} words.`);
  //       return;
  //     }

  //     setExtractedText(text);
  //     setFileName(file.name);
  //   } catch (err) {
  //     setErrorMsg("❌ Unexpected error extracting PDF.");
  //     console.error(err);
  //   } finally {
  //     setPdfUploading(false);
  //   }
  // };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // Clear input to allow re-selecting same file
    setErrorMsg("");
    setPdfUploading(true);

    if (!file || file.type !== "application/pdf") {
      setPdfUploading(false);
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMsg(
        `❌ File too large: ${(file.size / (1024 * 1024)).toFixed(2)} MB.`
      );
      setPdfUploading(false);
      return;
    }

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

      if (error) {
        setErrorMsg("❌ Failed to extract PDF.");
        return;
      }

      const wordCount = text.trim().split(/\s+/).length;
      if (wordCount > WORD_LIMIT) {
        setErrorMsg(`❌ PDF too long: ${wordCount} words.`);
        return;
      }

      setExtractedText(text);
      setFileName(file.name);
    } catch (err) {
      setErrorMsg("❌ Unexpected error extracting PDF.");
      console.error(err);
    } finally {
      setPdfUploading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e, {
      input,
      extractedText,
    });
    setInput(""); // reset UI input
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

        {pdfUploading && (
          <div className="pl-1">
            <Badge
              color="yellow"
              variant="light"
              className="text-xs animate-pulse"
            >
              ⏳ Extracting PDF...
            </Badge>
          </div>
        )}

        {errorMsg && (
          <div className="text-red-600 text-sm mt-1 px-2 py-1 border border-red-200 bg-red-50 rounded">
            {errorMsg}
          </div>
        )}

        {extractedText && (
          <Button
            variant="subtle"
            size="xs"
            className="text-blue-600 underline self-start"
            onClick={() => setModalOpen(true)}
          >
            📄 View Extracted Text
          </Button>
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
              component="label"
              variant="light"
              size="xs"
              className="w-[90px]"
              disabled={pdfUploading}
            >
              Upload PDF
              <input
                ref={fileInputRef}
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

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
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
