import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const image = formData.get("image") as File | null;
    const text = (formData.get("text") as string) || "";
    const custom = (formData.get("custom") as string) || "";

    let imagePart: any = null;

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imagePart = {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: image.type || "image/jpeg",
        },
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
${SYSTEM_PROMPT}

Contexto adicional do usuário: "${custom || text}"

\( {text ? `Texto da conversa fornecido:\n \){text}` : ""}
    `;

    const contents: any[] = imagePart ? [imagePart, { text: prompt }] : [{ text: prompt }];

    const result = await model.generateContent(contents);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Erro na API" }, { status: 500 });
  }
      }
