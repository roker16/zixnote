import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ActiveContext } from "@/utils/ai/contextStorage";
import {
  baseSystemPrompts,
  getContextPrompts,
  getStylePrompt,
  getNCERTPrompt,
  getMBBSPrompt,
  getUPSCGeneralStudiesPrompt,
  getUPSCOptionalPrompt,
} from "@/utils/ai/aiInstructionManager";
import { ChatCompletionMessageParam } from "openai/resources/chat";
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

    const contextString = getTargetAudience(context);

    let specialContextPrompts: ChatCompletionMessageParam[] = [];

    if (
      context.type === "school" &&
      context.schoolName?.toLowerCase() === "ncert" &&
      context.className &&
      context.bookName
    ) {
      specialContextPrompts = getNCERTPrompt(
        context.className,
        context.bookName
      );
    } else if (
      context.type === "college" &&
      context.collegeName?.toLowerCase() === "medical" &&
      context.course
    ) {
      specialContextPrompts = getMBBSPrompt(context.course);
    } else if (
      context.type === "exam" &&
      context.examName?.toLowerCase() === "upsc civil services"
    ) {
      if (context.paperName?.toLowerCase().startsWith("general studies")) {
        specialContextPrompts = getUPSCGeneralStudiesPrompt(context.paperName);
      } else if (context.subjectName) {
        specialContextPrompts = getUPSCOptionalPrompt(context.subjectName);
      }
    }

    // --- COMPOSE FINAL PROMPT MESSAGES ---
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      ...baseSystemPrompts,
      ...getContextPrompts(contextString),
      ...specialContextPrompts,
      // getStylePrompt(style),
      ...topic.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];
    console.log(messages);
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
