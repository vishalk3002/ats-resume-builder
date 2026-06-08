import { Prisma } from "@/src/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse-fork";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files allowed" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const data = await pdf(buffer);

    const extractedText = data.text;

    /* const resume = await prisma.resume.create({
  data: {
    title: file.name,
    content: {
      rawText: extractedText,
    },

   userId: SOME_USER_ID,
  },
});
 */

    if (!extractedText || extractedText.length < 100) {
      return NextResponse.json(
        { error: "Unreadable or image-based PDF" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      text: extractedText,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}
