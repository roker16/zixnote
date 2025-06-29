import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: "https://api.deepseek.com/",
});

export async function POST(req: Request) {
  try {
    const { topic, userId, count = 8, style = "academic" } = await req.json();

    // Validation
    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Topic must be a non-empty string" },
        { status: 400 }
      );
    }

    if (count < 3 || count > 15) {
      return NextResponse.json(
        { error: "Count must be between 3 and 15" },
        { status: 400 }
      );
    }

    // Style configuration
    const stylePrompts = {
      academic: "Use formal academic language suitable for university study",
      concise: "Prioritize brevity and clarity over completeness",
      exam: "Focus on concepts commonly tested in examinations",
      practical: "Emphasize real-world applications and case studies",
    };

    const systemPrompt = `
    You are an expert knowledge organizer. Generate ${count} subtopic titles for "${topic}" with these requirements:
    1. Each title should be 3-8 words
    2. Cover both foundational and advanced aspects
    3. Maintain logical progression (basic → intermediate → advanced)
    4. ${
      stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.academic
    }
    
    Return ONLY a JSON object with this structure:
    { "subtopics": string[] }
    `;

    // API call
    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Topic: ${topic}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 500,
    });

    // Response parsing with error handling
    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Empty AI response");

    const result = JSON.parse(content);
    const subtopics = result?.subtopics;

    if (!subtopics || !Array.isArray(subtopics)) {
      throw new Error("Invalid subtopics format");
    }

    // Clean and validate subtopics
    const cleanedSubtopics = subtopics
      .map((t: string) => (typeof t === "string" ? t.trim() : null))
      .filter((t: string | null) => t && t.length > 0);

    if (cleanedSubtopics.length === 0) {
      throw new Error("No valid subtopics generated");
    }

    return NextResponse.json({
      subtopics: cleanedSubtopics.slice(0, count),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[DEEPSEEK_SUBTOPICS_ERROR]", error);

    return NextResponse.json(
      {
        error: "Failed to generate subtopics",
        suggestion: "Try simplifying your topic or adjusting the count",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// TypeScript interface for expected request body
interface GenerateSubtopicsRequest {
  topic: string;
  userId?: string;
  count?: number;
  style?: "academic" | "concise" | "exam" | "practical";
}
