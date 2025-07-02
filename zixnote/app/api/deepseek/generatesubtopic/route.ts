import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: "https://api.deepseek.com/",
});

export async function POST(req: Request) {
  try {
    const { topic, userId, style = "academic", context } = await req.json();
    console.log(
      "Stringified context for AI prompt:\n",
      JSON.stringify(context ?? {}, null, 2)
    );

    // Validate topic
    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Topic must be a non-empty string" },
        { status: 400 }
      );
    }

    const stylePrompts = {
      academic:
        "Use formal academic language suitable for the educational level specified in the context",
      concise: "Prioritize brevity and clarity over completeness",
      exam: "Focus only on core concepts that would be tested",
      practical: "Emphasize real-world applications when relevant to context",
    };

    const systemPrompt = `
You are an expert academic notes maker that STRICTLY ADHERES TO CONTEXT.

Given the topic "${topic}" and the following context:

${JSON.stringify(context ?? {}, null, 2)}

Generate ONLY the most essential subtopic titles that cover this topic:
1. FIRST analyze the context carefully - especially noting:
   - Educational level (e.g., elementary, high school, college)
   - Scope/depth expected
   - Any specific requirements
2. Generate subtopics STRICTLY within the context's boundaries
3. For lower levels or limited contexts:
   - Generate fewer subtopics (typically 3-8)
   - Keep explanations simple and age-appropriate
4. For advanced contexts only:
   - You may include more subtopics (up to 15 max)
   - Include foundational → advanced progression
5. Each title should be 3-10 words
6. Writing style: ${
      stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.academic
    }
7. NEVER exceed what the context requires

Return ONLY a JSON object with this structure:
{ "subtopics": string[] }
`;

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Topic: ${topic}\n\nIMPORTANT: Be strictly guided by the context provided. Do not over-expand.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more focused responses
      max_tokens: 500, // Reduced to prevent over-explanation
    });

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
      subtopics: cleanedSubtopics.slice(0, 15), // Hard cap at 15
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[DEEPSEEK_SUBTOPICS_ERROR]", error);

    return NextResponse.json(
      {
        error: "Failed to generate subtopics",
        suggestion:
          "Try simplifying your topic or provide more specific context",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

interface GenerateSubtopicsRequest {
  topic: string;
  userId?: string;
  style?: "academic" | "concise" | "exam" | "practical";
  context?: {
    educationalLevel?: string;
    scope?: string;
    specificRequirements?: string;
    [key: string]: any;
  };
}
