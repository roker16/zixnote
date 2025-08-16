import { NextResponse } from "next/server";

// GET endpoint (simplest text response)
export async function GET() {
  return NextResponse.json(
    {
      message: "Hello from Next.js API!",
      users: [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
      ],
    },
    { status: 200 }
  );
}

// Optional: Handle POST requests (for testing)
export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    {
      receivedData: body,
      confirmation: "Data received successfully!",
    },
    { status: 200 }
  );
}
