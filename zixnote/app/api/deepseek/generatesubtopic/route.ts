import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  getMBBSSubtopicPrompt,
  getNCERTSubtopicPrompt,
  getSubtopicPrompt,
} from "@/utils/ai/aiSubtopicPrompt";
import { ActiveContext } from "@/utils/ai/contextStorage"; // for type safety
import { ChatCompletionMessageParam } from "openai/resources/chat";
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: "https://api.deepseek.com/",
});

export async function POST(req: Request) {
  try {
    const {
      topic,
      context,
      style = "academic",
    }: {
      topic: string;
      context: ActiveContext;
      style?: string;
    } = await req.json();

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json(
        { error: "Topic must be a non-empty string." },
        { status: 400 }
      );
    }

    // Determine system prompt
    let systemPrompts: ChatCompletionMessageParam[];

    if (
      context?.type === "school" &&
      context.schoolName?.toLowerCase() === "ncert" &&
      context.className &&
      context.bookName
    ) {
      systemPrompts = getNCERTSubtopicPrompt(
        context.className,
        context.bookName
      );
    } else if (
      context?.type === "college" &&
      context.collegeName?.toLowerCase() === "medical" &&
      context.course
    ) {
      systemPrompts = getMBBSSubtopicPrompt(context.course);
    } else {
      systemPrompts = getSubtopicPrompt(topic, context);
    }
    // console.log(systemPrompts);
    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        ...systemPrompts,
        {
          role: "user",
          content: `Topic: ${topic}\n\nStrictly follow the above instructions.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from model");

    const parsed = JSON.parse(content);
    const subtopics = Array.isArray(parsed.subtopics)
      ? (parsed.subtopics as string[])
      : null;

    if (!subtopics || subtopics.length === 0) {
      throw new Error("No valid subtopics returned by model");
    }

    const cleaned = subtopics
      .map((t: string) => t.trim())
      .filter((t): t is string => !!t && t.length > 0)
      .slice(0, 15);

    return NextResponse.json({
      subtopics: cleaned,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[SUBTOPIC_API_ERROR]", error);
    return NextResponse.json(
      {
        error: "Failed to generate subtopics.",
        suggestion: "Try simplifying your topic or providing clearer context.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
