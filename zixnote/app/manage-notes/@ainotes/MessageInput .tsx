import React from "react";
import { Textarea, Button } from "@mantine/core";

interface MessageInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const MessageInputComponent = ({
  input,
  setInput,
  handleSubmit,
  isLoading,
}: MessageInputProps) => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent new line
      formRef.current?.requestSubmit(); // manually submit the form
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex gap-2 items-end"
    >
      <Textarea
        data-autofocus
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask something to do..."
        disabled={isLoading}
        className="flex-1"
        minRows={2}
        maxRows={4}
      />
      <Button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-600"
      >
        {isLoading ? "Sending..." : "Send"}
      </Button>
    </form>
  );
};

MessageInputComponent.displayName = "MessageInputComponent";

export const MessageInput = React.memo(MessageInputComponent);
