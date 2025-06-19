import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: "https://api.deepseek.com/",
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    // Explicitly type messages to match OpenAI.Chat.ChatCompletionMessageParam
    const formattedMessages: OpenAI.Chat.ChatCompletionMessageParam[] =
      messages.map(
        (msg: { role: "user" | "assistant" | "system"; content: string }) => ({
          role: msg.role,
          content: msg.content,
        })
      );

    const stream = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: formattedMessages,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("DeepSeek API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch response" },
      { status: 500 }
    );
  }
}
