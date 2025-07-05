import { ActiveContext } from "@/utils/ai/contextStorage";
import { ChatCompletionMessageParam } from "openai/resources/chat";
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

export function getSubtopicPrompt(
  topic: string,
  context: ActiveContext
): ChatCompletionMessageParam[] {
  const audience = getTargetAudience(context);

  return [
    {
      role: "system",
      content: `You are an expert in academic note structuring. Your task is to generate **clear, self-contained subtopics** for the given topic.`,
    },
    {
      role: "system",
      content: `TOPIC: "${topic}"`,
    },
    {
      role: "system",
      content: `CONTEXT: ${audience}`,
    },
    {
      role: "system",
      content: `TARGET AUDIENCE: ${audience}`,
    },

    {
      role: "system",
      content: `RULES:
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
`,
    },
    {
      role: "system",
      content: `Return ONLY a JSON object with this structure:\n{ "subtopics": string[] }`,
    },
  ];
}
export function getNCERTSubtopicPrompt(
  className: string,
  bookName: string
): ChatCompletionMessageParam[] {
  return [
    {
      role: "system",
      content: `Context: You are generating structured subtopics for a school-level note based on the NCERT curriculum.`,
    },
    {
      role: "system",
      content: `Class: ${className}, Book: ${bookName}. Follow the depth and style of official NCERT chapters.`,
    },
    {
      role: "system",
      content: `Ensure that subtopics are age-appropriate, factually accurate, and well-aligned with NCERT’s chapter format.`,
    },
    {
      role: "system",
      content: `Use clear and simple academic language. Avoid complex analysis, political commentary, or exam strategy. Focus only on academic clarity.`,
    },
    {
      role: "system",
      content: `Subtopics should:
- Reflect typical chapter sections from NCERT (e.g., Introduction, Key Concepts, Applications)
- Stay within 4–20 words each, maximum subtopic generated 4, but designed such that it covers full scope of topic. First subtopic generated should be same as the main topic.
- Avoid vague terms like "Overview", "Notes", or "Explanation"
- Be relevant to the chapter's context and audience level`,
    },
    {
      role: "system",
      content: `Return ONLY a JSON object with this structure:\n{ "subtopics": string[] }`,
    },
  ];
}

export function getMBBSSubtopicPrompt(
  course: string
): ChatCompletionMessageParam[] {
  return [
    {
      role: "system",
      content: `You are an academic assistant for MBBS students in India. Your task is to generate structured, self-contained subtopics for a given medical subject.`,
    },
    {
      role: "system",
      content: `Course: ${course}. The content should reflect the standard MBBS syllabus in Indian medical colleges.`,
    },
    {
      role: "system",
      content: `Audience: Undergraduate MBBS students. Assume the learner is preparing for university exams or clinical applications.`,
    },
    {
      role: "system",
      content: `Tone: Use clear, formal, medically accurate language suitable for first- to fourth-year MBBS students.`,
    },
    {
      role: "system",
      content: `RULES:
1. Subtopics must be relevant to the medical course and logically ordered (e.g., from anatomical structure → function → clinical relevance).
2. Each subtopic must be 4–10 words and medically self-explanatory (avoid vague titles like “Overview”).
3. Each subtopic must be **standalone and include the topic if needed** — do not rely on prior context.
4. Prioritize accuracy and clinical clarity — do not include speculative or non-textbook content.

7. Limit subtopics to 5–12, depending on scope.`,
    },

    {
      role: "system",
      content: `Return ONLY a JSON object with this structure:\n{ "subtopics": string[] }`,
    },
  ];
}
