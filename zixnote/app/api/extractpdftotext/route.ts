import { NextRequest, NextResponse } from "next/server";

// export const runtime = "nodejs";
export const config = {
  api: {
    responseLimit: false,
  },
};
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Log file details for debugging
    console.log("Uploaded file:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamically import pdf2json
    const PDFParser = (await import("pdf2json")).default;
    const pdfParser = new PDFParser();

    const data = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        const text = pdfData.Pages.map((page: any) =>
          page.Texts.map((text: any) => decodeURIComponent(text.R[0].T)).join(
            " "
          )
        ).join("\n");
        resolve({ text });
      });
      pdfParser.on("pdfParser_dataError", (err) => reject(err));
      pdfParser.parseBuffer(buffer);
    });

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("PDF extraction failed:", err.message, err.stack);
    return NextResponse.json(
      { error: "Failed to extract PDF text", details: err.message },
      { status: 500 }
    );
  }
}
