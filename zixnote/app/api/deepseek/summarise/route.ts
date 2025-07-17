import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize DeepSeek API client
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: "https://api.deepseek.com/",
});

export async function POST(req: Request) {
  console.log("inside summariser");
  try {
    const { text }: { text: string } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "No text provided." }, { status: 400 });
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `
You are a summarization assistant.Your task is to create a **factually accurate summary** of the input text. 

Your task is to create a concise summary that:
- Includes every the facts, terms, names, numbers, and examples found in the original text.
- Avoids vague expressions like "various types", "some examples", or "several kinds".
- Explicitly lists all types, categories, and examples mentioned in the input.
- Does not invent or assume any information that is not directly provided.
- Sticks strictly to the source text — no external knowledge or creativity.
-Be precise, factual, and structured in your output.-
    `.trim(),
      },
      {
        role: "system",
        content: `Use Proper headings to summarise.
        Incorporate tables, lists where helpful.
        Use bold formatting to emphasize important terms, such as: Definitions, acts, dates, numbers, categories, causes, and key terms.
Maintain logical Herirarchy of content, use Headings, subheadings, numbering etc for this purpose.
         `,
      },
      {
        role: "system",
        content: `Maintain logical Herirarchy of content, use Headings, subheadings, numbering etc for this purpose.
         `,
      },
      {
        role: "user",
        content: `Summarize the following text:\n\n${text}`,
      },
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
          console.error("[DEEPSEEK_SUMMARY_STREAM_ERROR]", err);
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
    console.error("[DEEPSEEK_SUMMARISE_API_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to summarize text using DeepSeek." },
      { status: 500 }
    );
  }
}
