"use client";
import { useState } from "react";

export default function PDFUploader() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setText("");
    setError("");
    setWordCount(0);

    if (!e.target.files?.[0]) {
      setError("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        const extractedText = result.text || "No text extracted";
        setText(extractedText);
        setWordCount(countWords(extractedText));
      } else {
        setError(result.error || "Failed to extract PDF text");
      }
    } catch (err: any) {
      setError("Request failed: " + err.message);
    }
  };

  const countWords = (str: string) => {
    return str
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  return (
    <div className="p-4">
      <input type="file" accept="application/pdf" onChange={handleUpload} />

      {text && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">Word Count: {wordCount}</p>
          <pre className="whitespace-pre-wrap mt-2">{text}</pre>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
