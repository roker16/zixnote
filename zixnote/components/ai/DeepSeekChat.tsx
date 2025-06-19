"use client";

import { useState, useRef, useEffect } from "react";
import {
  TextInput,
  Button,
  ScrollArea,
  Group,
  Avatar,
  Paper,
} from "@mantine/core";
import { IconUser, IconRobot } from "@tabler/icons-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function DeepSeekChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsStreaming(false);
    setError(null);

    try {
      const response = await fetch("/api/deepseek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
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
              setError("Failed to parse response. Please try again.");
            }
          }
        }
      }
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error.message || "An error occurred. Please try again.",
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
                className={`max-w-[90%] ${
                  message.role === "user"
                    ? "bg-gray-200 text-gray-900"
                    : "bg-gray-100 text-gray-800"
                } rounded-lg shadow-sm opacity-100`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-xl font-bold mt-2 mb-1" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-lg font-semibold mt-2 mb-1"
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
                className="bg-gray-200 text-gray-900 rounded-lg animate-pulse opacity-100"
              >
                <p>Thinking...</p>
              </Paper>
            </Group>
          )}

          {/* Invisible scroll target */}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex gap-2">
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
      </form>
    </div>
  );
}
