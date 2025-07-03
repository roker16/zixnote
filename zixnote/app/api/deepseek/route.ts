import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ActiveContext } from "@/utils/ai/contextStorage";
import {
  baseSystemPrompts,
  getContextPrompts,
  getStylePrompt,
} from "@/utils/ai/aiInstructionManager";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: "https://api.deepseek.com/",
});

function getTargetAudience(context: ActiveContext): string {
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

export async function POST(req: Request) {
  try {
    const {
      topic,
      context,
      style = "academic",
    }: {
      topic: { role: "user" | "system" | "assistant"; content: string }[];
      context: ActiveContext;
      style?: string;
    } = await req.json();

    if (!topic || !Array.isArray(topic) || topic.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty topic message list." },
        { status: 400 }
      );
    }

    // Get dynamic context string
    const contextString = getTargetAudience(context); // Already returns smart context summary

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      ...baseSystemPrompts,
      ...getContextPrompts(contextString),
      getStylePrompt(style),
      ...topic.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const stream = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages,
      stream: true,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n"));
          controller.close();
        } catch (err) {
          console.error("[STREAM_ERROR]", err);
          controller.error(err);
        }
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("[DEEPSEEK_NOTES_API_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to generate notes from AI." },
      { status: 500 }
    );
  }
}
