export function normalizeLatex(chunk: string): string {
  // Handle empty or non-string chunks
  if (!chunk || typeof chunk !== "string") return chunk;

  return (
    chunk
      // Normalize complete \[...\] to $$...$$
      .replace(/\\\[\s*([^]*?[^\\])\s*\\\]/g, (_, expr) => `$$${expr.trim()}$$`)
      // Normalize complete \(...\) to $...$
      .replace(/\\\(\s*([^]*?[^\\])\s*\\\)/g, (_, expr) => `$${expr.trim()}$`)
      // Preserve complete $$...$$, trim whitespace
      .replace(/\$\$([^]*?[^\\])\$\$/g, (_, expr) => `$$${expr.trim()}$$`)
      // Preserve complete $...$, trim whitespace, avoid $$...$$
      .replace(/\$([^$][^]*?[^\\])\$/g, (_, expr) => `$${expr.trim()}$`)
      // Escape unclosed delimiters to prevent rendering issues
      .replace(/\\\[([^]*?)(?=$|\\\[|\\\(|\\])/g, (_, expr) => `\\[${expr}`)
      .replace(/\\\(([^]*?)(?=$|\\\[|\\\(|\\])/g, (_, expr) => `\\(${expr}`)
      .replace(/\$([^$][^]*?)(?=$|\\\[|\\\(|\\])/g, (_, expr) => `$${expr}`)
  );
}

export function cleanMarkdown(content: string): string {
  // Strip any outer ```markdown ... ``` or ```...``` block, more flexible
  const stripped = content.replace(/^```(?:\w+)?\s*([\s\S]*?)\s*```$/, "$1");
  // Unescape markdown characters
  return stripped.replace(/\\([#*_`\-])/g, "$1");
}
