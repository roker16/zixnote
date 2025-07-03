import { ActiveContext } from "@/utils/ai/contextStorage";

export function getTargetAudience(context: ActiveContext): string {
  if (!context) return "students";

  switch (context.type) {
    case "school":
      return `${context.className} students, ${context.schoolName}, Book: ${context.bookName}`;
    case "college":
      return `${context.course} students, Department of ${context.department}, ${context.collegeName}`;
    case "exam":
      return `${context.examName}, ${context.paperName}, ${context.subjectName}`;
    default:
      return "students";
  }
}

const styleInstructions: Record<string, string> = {
  academic: "Use formal academic language suitable for the specified level.",
  concise: "Prioritize brevity and clarity without losing meaning.",
  exam: "Focus only on core concepts likely to be tested in exams.",
  practical:
    "Emphasize real-world applications where contextually appropriate.",
};

export function getSubtopicPrompt({
  topic,
  context,
  style = "academic",
}: {
  topic: string;
  context: ActiveContext;
  style?: string;
}): string {
  const audience = getTargetAudience(context);
  const styleInstruction =
    styleInstructions[style as keyof typeof styleInstructions] ||
    styleInstructions.academic;

  return `
You are an expert in academic note structuring. Your task is to generate **clear, self-contained subtopics** for the given topic.

TOPIC:
"${topic}"

CONTEXT:
${audience}

TARGET AUDIENCE:
${audience}

STYLE:
${styleInstruction}

RULES:
1. Analyze the context carefully to determine scope and depth.
2. Subtopics must be **strictly relevant to the topic and context**.
3. Each subtopic must be **4–10 words**, complete, and self-explanatory — avoid vague terms like "Overview" or "Conclusion".
4. Use academic phrasing, not headlines or shorthand.
5. Limit subtopics as per level:
   - School-level/narrow scope: 3–7 subtopics
   - Broader/advanced context: up to 15
6. Maintain logical academic structure:
   - From basics → core ideas → application/analysis (if appropriate)
7. Do **NOT** include:
   - Any extra commentary, examples, explanations, or formatting
   - Subtopics that assume things not in context

Return ONLY a JSON object with this structure:
{ "subtopics": string[] }
`;
}
