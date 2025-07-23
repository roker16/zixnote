"use client";

import { logKPIEvent } from "@/app/kpitracker/logKPIEvent";
import { MessageInput } from "@/app/manage-notes/@ainotes/MessageInput ";
import { getActiveContext } from "@/utils/ai/contextStorage";
import { createClient } from "@/utils/supabase/client";
import { ActionIcon, Avatar, Group, Paper, ScrollArea } from "@mantine/core";
import { IconRobot, IconUser } from "@tabler/icons-react";
import "katex/dist/katex.min.css";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MdAddToQueue, MdAssistant, MdSave } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { showNotifications } from "../Notification";
import { showErrorNotification } from "../showErrorNotification";
import { cleanMarkdown, normalizeLatex } from "@/utils/ai/cleanAiResponse";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  internal?: boolean; // 👈 mark hidden instructions
}

export default function DeepSeekChat({
  noteId,
  initialContent,
  notesTitle,
}: {
  noteId: number;
  notesTitle: string;
  initialContent: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [hasSentExtractedText, setHasSentExtractedText] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const assistantRefs = useRef<(HTMLDivElement | null)[]>([]);
  const supabase = createClient();
  const searchParams = useSearchParams();

  // const headingname = searchParams.get("headingname");
  const subjectName = searchParams.get("name");
  const headingId = searchParams.get("headingid");
  useEffect(() => {
    const getUser = async () => {
      setUserId((await supabase.auth.getUser()).data.user?.id);
    };

    getUser();
  }, [supabase.auth]);
  //Initial prompt if content is not available
  useEffect(() => {
    if (!initialContent?.trim() && notesTitle) {
      const defaultPrompt = `Prepare Detailed notes on "${notesTitle}" under the subject "${subjectName}". `;
      setInput(defaultPrompt);
    }
  }, [initialContent, subjectName, notesTitle]);

  // Load initial system message from note content
  useEffect(() => {
    if (initialContent) {
      //do not again clean and normalized because it was already done while saving
      setMessages([
        {
          role: "system",
          content: `Here is the current note content:\n\n${initialContent}`,
        },
      ]);
    }
  }, [initialContent]);

  // Scroll on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const handleAppendToNotes = async (content: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("notes")
        .select("ainotes_english")
        .eq("id", noteId)
        .single();

      if (fetchError)
        throw new Error("Failed to fetch existing note: " + fetchError.message);

      const existingContent = data?.ainotes_english || "";

      const updatedContent = `${existingContent.trim()}\n\n${content.trim()}`;

      const { error: updateError } = await supabase
        .from("notes")
        .update({ ainotes_english: updatedContent })
        .eq("id", noteId);

      if (updateError)
        throw new Error("Failed to append note: " + updateError.message);

      showNotifications(null, "updated");
    } catch (err: any) {
      showErrorNotification(err.message);
    }
  };

  const handleSaveToNotes = async (content: string) => {
    const cleaned = cleanMarkdown(content);
    console.log(content);
    console.log(normalizeLatex(content));
    try {
      const { error } = await supabase
        .from("notes")
        .update({ ainotes_english: content })
        .eq("id", noteId);

      if (error) throw new Error("Failed to update note: " + error.message);
      // ✅ Log KPI event: note updated
      await logKPIEvent("note_updated", { book_name: subjectName });
      showNotifications(null, "updated");
    } catch (err: any) {
      showErrorNotification(err.message);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    payload: { input: string; extractedText: string }
  ) => {
    e.preventDefault();
    const { input: userInput, extractedText } = payload;

    if (!userInput.trim() || isLoading) return;

    const wordCount = userInput.trim().split(/\s+/).length;

    const newMessages: Message[] = [];

    newMessages.push({ role: "user", content: userInput });
    // Inject extractedText only once
    if (!hasSentExtractedText && extractedText.trim()) {
      newMessages.push({
        role: "user",
        content: "Extracted: " + extractedText,
        internal: true,
      });
      setHasSentExtractedText(true);
    }

    // Add actual user message

    const updatedMessages = [...messages, ...newMessages];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setIsStreaming(false);
    setError(null);

    try {
      const shouldUseExtractedAPI =
        extractedText.trim() !== "" || hasSentExtractedText;
      const endpoint =
        wordCount >= 150
          ? "/api/deepseek/summarise"
          : shouldUseExtractedAPI
          ? "/api/deepseek/respondextractedtext"
          : "/api/deepseek";

      const requestPayload =
        wordCount >= 150
          ? { text: userInput }
          : {
              topic: updatedMessages,
              context: getActiveContext(),
              style: "academic",
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
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
              const content = parsed.content || "";

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
    <div className="max-w-6xl mx-auto p-0 h-screen flex flex-col">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Your Dizinote Assistant <MdAssistant />
      </h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <ScrollArea className="flex-1 w-full border rounded-lg mb-16 bg-gray-50 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.length === 0 && (
            <>
              <p className="text-gray-500 text-center">
                Start Asking anything from your Dizinote assistant!
              </p>
              <p className="text-gray-500 text-center">
                Ask for formatting (delete, add, highlight, color)
              </p>
              <p className="text-gray-500 text-center">
                Ask to insert image if you provide link to image
              </p>
            </>
          )}

          {messages
            .filter((message) => !message.internal)
            .map((message, index) => (
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
                    <div className="  flex justify-center  gap-2">
                      <ActionIcon
                        onClick={() => handleSaveToNotes(message.content)}
                        title="Save to Notes"
                        variant="filled"
                        color="red"
                      >
                        <MdSave size={24} />
                      </ActionIcon>
                      <ActionIcon
                        onClick={() => handleAppendToNotes(message.content)}
                        title="Append to Notes"
                        variant="filled"
                        color="blue"
                      >
                        <MdAddToQueue size={16} className="rotate-90" />
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
                            className="text-2xl font-bold mt-2 mb-1 "
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
                            className="text-lg font-semibold mt-4 mb-1 text-blue-600"
                            {...props}
                          />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            className=" text-base font-semibold mt-4 mb-1  text-red-700 underline underline-offset-2"
                            {...props}
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
                          <thead
                            className="bg-red-900 border border-red-400 "
                            {...props}
                          />
                        ),
                        th: ({ node, ...props }) => (
                          <th
                            className="border border-gray-400 px-3 py-2 text-left font-medium bg-red-200 "
                            {...props}
                          />
                        ),
                        tbody: ({ node, ...props }) => (
                          <tbody
                            className="border border-gray-300 "
                            {...props}
                          />
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
                        li: ({ node, ...props }) => (
                          <li className="my-0.5 " {...props} />
                        ),
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
                      {message.content}
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
      <div className="sticky bottom-8 bg-white pt-2">
        <MessageInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          indexId={Number(headingId)}
          profileId={userId}
        />
      </div>
    </div>
  );
}
