"use client";

import * as pdfjsLib from "pdfjs-dist";

// Set worker source to local file in public folder
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export async function extractTextFromPDF(file: File): Promise<string> {
  //   console.log("Starting PDF extraction...");
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: any) => item.str || "").join(" ");
    fullText += `\n\nPage ${i}:\n${text}`;
  }
  return fullText;
}
