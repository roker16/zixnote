"use client";

import { useState, useRef, useEffect } from "react";
import {
  TextInput,
  Button,
  ScrollArea,
  Group,
  Avatar,
  Paper,
  ActionIcon,
} from "@mantine/core";
import { IconUser, IconRobot } from "@tabler/icons-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { MdSave } from "react-icons/md";
import "katex/dist/katex.min.css";
import { createClient } from "@/utils/supabase/client";
import { MessageInput } from "@/app/manage-notes/@ainotes/MessageInput ";
import { showNotification } from "@mantine/notifications";
import { showNotifications } from "../Notification";
import { showErrorNotification } from "../showErrorNotification";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function DeepSeekChat({
  noteId,
  initialContent,
}: {
  noteId: number;
  initialContent: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const assistantRefs = useRef<(HTMLDivElement | null)[]>([]);
  const supabase = createClient();

  // Normalize LaTeX syntax
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
      .replace(
        /\$\$\s*([^]*?)\s*\$\$/g,
        (_, expr) => `\\[ $${expr.trim()}$ \\]`
      )
      .replace(/\$(?!\$)([^$]+?)\$/g, (_, expr) => ` $${expr.trim()}$ `);
  };

  // Load initial system message from note content
  useEffect(() => {
    if (initialContent) {
      const normalized = normalizeLatex(initialContent);
      setMessages([
        {
          role: "system",
          content: `Here is the current note content:\n\n${normalized}`,
        },
      ]);
    }
  }, [initialContent]);

  // Scroll on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const handleSaveToNotes = async (content: string) => {
    try {
      const { error } = await supabase
        .from("notes")
        .update({ ainotes_english: content })
        .eq("id", noteId);

      if (error) throw new Error("Failed to update note: " + error.message);
      showNotifications(null, "updated");
    } catch (err: any) {
      showErrorNotification(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setIsStreaming(false);
    setError(null);

    try {
      const response = await fetch("/api/deepseek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No readable stream");

      setIsStreaming(true);
      let assistantMessage = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const content = normalizeLatex(parsed.content || "");
              if (content) {
                assistantMessage += content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantMessage,
                  };
                  return updated;
                });
              }
            } catch (e) {
              setError("Failed to parse response");
            }
          }
        }
      }
    } catch (error: any) {
      setError(error.message || "An error occurred");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error.message || "An error occurred",
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Your AI Assistant
      </h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <ScrollArea className="flex-1 w-full border rounded-lg p-4 mb-4 bg-gray-50">
        <div className="flex flex-col space-y-4">
          {messages.length === 0 && (
            <p className="text-gray-500 text-center">
              Start chatting with DeepSeek!
            </p>
          )}

          {messages.map((message, index) => (
            <Group
              key={index}
              className={`${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
              align="flex-start"
            >
              <Avatar
                color={message.role === "user" ? "blue" : "gray"}
                radius="xl"
                size="sm"
                className="mt-1"
              >
                {message.role === "user" ? (
                  <IconUser size={16} />
                ) : (
                  <IconRobot size={16} />
                )}
              </Avatar>

              <Paper
                p="md"
                className={`relative max-w-[90%] ${
                  message.role === "user"
                    ? "bg-gray-200 text-gray-900"
                    : "bg-gray-100 text-gray-800"
                } rounded-lg shadow-sm`}
              >
                {message.role === "assistant" && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <ActionIcon
                      onClick={() => handleSaveToNotes(message.content)}
                      title="Save to Notes"
                      variant="subtle"
                      color="red"
                    >
                      <MdSave size={16} />
                    </ActionIcon>
                  </div>
                )}
                <div
                  ref={(el) => {
                    assistantRefs.current[index] = el;
                  }}
                  className="mt-4"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1
                          className="text-xl font-bold mt-2 mb-1"
                          {...props}
                        />
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
                          className="text-lg font-semibold mt-2 mb-1"
                          {...props}
                        />
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
                        <thead
                          className="bg-red-900 border border-red-400"
                          {...props}
                        />
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
                      li: ({ node, ...props }) => (
                        <li className="my-0.5" {...props} />
                      ),
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
                    {normalizeLatex(message.content)}
                  </ReactMarkdown>
                </div>
              </Paper>
            </Group>
          ))}
          {isLoading && !isStreaming && (
            <Group>
              <Avatar color="gray" radius="xl" size="sm" className="mt-1">
                <IconRobot size={16} />
              </Avatar>
              <Paper
                p="md"
                className="bg-gray-200 text-gray-900 rounded-lg animate-pulse"
              >
                <p>Thinking...</p>
              </Paper>
            </Group>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* <form onSubmit={handleSubmit} className="flex gap-2">
        <TextInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask DeepSeek something..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form> */}
      <MessageInput
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
