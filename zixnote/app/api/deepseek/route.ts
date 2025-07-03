import { ActiveContext } from "@/utils/ai/contextStorage";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// -------------------------
// Helper: Dynamic Target Audience
// -------------------------
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

// -------------------------
// API Handler
// -------------------------
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
    console.log(
      "Stringified context for AI notes:\n",
      JSON.stringify(context ?? {}, null, 2)
    );
    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Topic must be a non-empty string." },
        { status: 400 }
      );
    }

    const targetAudience = getTargetAudience(context);

    const styleInstructions: Record<string, string> = {
      academic:
        "Use formal academic tone, appropriate for UPSC or university-level studies.",
      concise: "Be clear and to the point, avoid unnecessary fluff.",
      exam: "Structure notes to align with commonly asked exam questions.",
      practical:
        "Include real-world applications and examples relevant to India.",
    };

    const systemPrompt = `
You are a highly qualified academic note-making assistant.

Your task is to generate **structured, high-quality academic notes** on the topic:
"${topic}"

Use the context below to tailor your response:
${JSON.stringify(context ?? {}, null, 2)}

Instructions:
- Begin with a short introduction to the topic.
- Break down the content into logical sections and subheadings.
- Use bullet points and formatting where helpful.
- Include definitions, explanations, and (where possible) examples, diagrams, or case studies.
- Maintain a logical academic flow: Introduction → Core Concepts → Examples → Analysis → Conclusion.
- Keep in mind the target audience: ${targetAudience}.
- ${styleInstructions[style] || styleInstructions["academic"]}

Only return the notes. Do not include any preamble or system message.
`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Generate academic notes for topic: "${topic}"`,
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
