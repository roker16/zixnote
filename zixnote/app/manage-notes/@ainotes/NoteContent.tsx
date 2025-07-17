"use client";

import { useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { ActionIcon, Button, Paper, Tooltip } from "@mantine/core";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import AiDrawer from "./AiDrawer";
import { IconPdf, IconPrinter } from "@tabler/icons-react";
import { cleanMarkdown, normalizeLatex } from "@/utils/ai/cleanAiResponse";

interface NoteContentProps {
  noteId: number;
  noteTitle: string;
}

interface Note {
  ainotes_english: string;
}

function NoteContent({ noteId, noteTitle }: NoteContentProps) {
  const supabase = createClient();
  const printRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery<Note>(
    supabase.from("notes").select("ainotes_english").eq("id", noteId).single(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: true,
    }
  );

  // const normalizedContent = data?.ainotes_english
  //   ? cleanMarkdown(normalizeLatex(data.ainotes_english))
  //   : "No notes content available";
  const normalizedContent = data?.ainotes_english
    ? data.ainotes_english
    : "No notes content available";

  const handlePrint = async () => {
    if (!printRef.current) return;

    const html2pdf = (await import("html2pdf.js")).default;

    html2pdf()
      .set({
        margin: [5, 5, 5, 5],
        filename: `note-${noteId}.pdf`,
        html2canvas: {
          scale: 2, // Higher scale for sharper text
          useCORS: true,
          allowTaint: true,
          logging: false,
          dpi: 300, // Higher DPI for better clarity
          letterRendering: true, // Improve text rendering
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },
        pagebreak: {
          mode: "css",
          avoid: ["table", "p", "h1", "h2", "li", "code"],
        },
      })
      .from(printRef.current)
      .save();
  };

  return (
    <Paper
      p="md"
      shadow="sm"
      radius="md"
      bg="white"
      mx={"lg"}
      my={"xs"}
      px={"xl"}
      className="max-w-[100%]"
    >
      <div className="w-full flex justify-end mb-2 gap-1">
        <AiDrawer
          topicId={noteId.toString()}
          initialNoteContent={data?.ainotes_english || ""}
          notesTitle={noteTitle}
        />
        <Tooltip label="Print PDF" withArrow>
          <ActionIcon
            onClick={handlePrint}
            variant="filled"
            color="red"
            size="md"
          >
            <IconPdf size={18} />
          </ActionIcon>
        </Tooltip>
      </div>

      <div ref={printRef} className="avoid-page-break printable-content">
        <style>{`
          @media print {
            body { margin: 0; padding: 0; font-size: 10pt; font-family: Arial, sans-serif; }
            .printable-content { width: 100%; max-width: 200mm; margin: 5mm auto; }
            table, p, h1, h2, li, code { page-break-inside: avoid; break-inside: avoid; }
            table { width: 100%; max-width: 100%; table-layout: fixed; }
            img { max-width: 100%; height: auto; }
            code { white-space: pre-wrap; word-break: break-word; }
          }
        `}</style>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-2xl font-bold mt-2 mb-1 " {...props} />
            ),
            img: ({ node, ...props }) => (
              <img
                className="my-2 max-w-[400px] w-full h-auto rounded-lg border border-gray-300"
                loading="lazy"
                alt=""
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-lg font-semibold mt-4 mb-1 text-blue-600"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                {...props}
                className="underline underline-offset-2 text-base font-semibold mt-4 mb-1  text-red-700"
              />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-2 ">
                <table
                  className="table-auto w-full border-collapse border border-gray-800 "
                  {...props}
                />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead className="bg-red-900 border border-red-400 " {...props} />
            ),
            th: ({ node, ...props }) => (
              <th
                className="border border-gray-400 px-3 py-2 text-left font-medium bg-red-200 "
                {...props}
              />
            ),
            tbody: ({ node, ...props }) => (
              <tbody className="border border-gray-300 " {...props} />
            ),
            td: ({ node, ...props }) => (
              <td
                className="border border-blue-300 bg-slate-100 px-3 py-2"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p className="my-1 leading-relaxed " {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-4 my-1 " {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-4 my-1 " {...props} />
            ),
            li: ({ node, ...props }) => <li className="my-0.5 " {...props} />,
            strong: ({ node, ...props }) => (
              <strong className="font-bold " {...props} />
            ),
            code: ({ node, ...props }) => (
              <code
                className="bg-gray-800 text-gray-200 rounded px-1 avoid-page-break"
                {...props}
              />
            ),
          }}
        >
          {normalizedContent}
        </ReactMarkdown>
      </div>
    </Paper>
  );
}

export default NoteContent;
