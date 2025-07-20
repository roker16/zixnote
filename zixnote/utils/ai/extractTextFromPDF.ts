import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    // Group text items by Y-coordinate (line-level)
    const lines: Record<number, string[]> = {};

    for (const item of content.items as any[]) {
      const text = item.str;
      const y = Math.round(item.transform[5]); // Round to group similar lines

      if (!lines[y]) lines[y] = [];
      lines[y].push(text);
    }

    // Sort lines from top to bottom (descending Y)
    const sortedY = Object.keys(lines)
      .map(Number)
      .sort((a, b) => b - a);

    const pageText = sortedY.map((y) => lines[y].join(" ")).join("\n");

    fullText += `\n\nPage ${pageNum}:\n${pageText}`;
  }

  return fullText.trim();
}
