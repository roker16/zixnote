"use client";
import { createClient } from "@/utils/supabase/client";
import { Button, Paper } from "@mantine/core";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

import "katex/dist/katex.min.css";
import AiDrawer from "./AiDrawer";

interface NoteContentProps {
  noteId: number;
}

interface Note {
  ainotes_english: string;
}

function NoteContent({ noteId }: NoteContentProps) {
  const supabase = createClient();

  const { data } = useQuery<Note>(
    supabase.from("notes").select("ainotes_english").eq("id", noteId).single(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: true,
    }
  );

  const normalizeLatex = (content: string): string => {
    return content
      .replace(
        /\\\[\s*(?!\$)([^]*?)(?!\$)\s*\\\]/g,
        (_, expr) => `\\[ $${expr.trim()}$ \\]`
      )
      .replace(
        /\\\(\s*(?!\$)([^]*?)(?!\$)\s*\\\)/g,
        (_, expr) => `\\( $${expr.trim()}$ \\)`
      )
      .replace(/\$$\s*([^]*?)\s*\$$/g, (_, expr) => `\\[ $${expr.trim()}$ \\]`)
      .replace(/\$(?!\$)([^$]+?)\$/g, (_, expr) => ` $${expr.trim()}$ `);
  };

  const normalizedContent = data?.ainotes_english
    ? normalizeLatex(data.ainotes_english)
    : "No notes content available";

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
      <div className="w-full flex justify-end">
        <AiDrawer
          topicId={noteId.toString()}
          initialNoteContent={data?.ainotes_english || ""}
        />
      </div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold mt-2 mb-1" {...props} />
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
            <h2 className="text-lg font-semibold mt-2 mb-1" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-2">
              <table
                className="table-auto w-full border-collapse border border-gray-800"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-red-900 border border-red-400" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="border border-gray-400 px-3 py-2 text-left font-medium bg-red-200"
              {...props}
            />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="border border-gray-300" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td
              className="border border-blue-300 bg-slate-100 px-3 py-2"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p className="my-1 leading-relaxed" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-4 my-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-4 my-1" {...props} />
          ),
          li: ({ node, ...props }) => <li className="my-0.5" {...props} />,
          strong: ({ node, ...props }) => (
            <strong className="font-bold" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code
              className="bg-gray-800 text-gray-200 rounded px-1"
              {...props}
            />
          ),
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </Paper>
  );
}

export default NoteContent;
