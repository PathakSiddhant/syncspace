import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured." },
        { status: 500 }
      );
    }

    // 2. Extract data from the frontend request
    const { boardText, type } = await req.json();

    if (!boardText) {
      return NextResponse.json(
        { error: "No board data provided." },
        { status: 400 }
      );
    }

    // 3. Initialize Gemini (Using the fast gemini-1.5-flash model)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 4. Create the perfect Prompt based on what the user wants
    let systemPrompt = "";
    if (type === "summary") {
      systemPrompt = `You are a highly intelligent collaboration assistant. Analyze the following text extracted from a digital whiteboard. Provide a clear, structured, and professional Meeting Summary. Group similar ideas and highlight key decisions. Format the response beautifully using Markdown.

Whiteboard Data:
${boardText}`;
    } else if (type === "action-items") {
      systemPrompt = `You are a highly efficient project manager. Analyze the following text extracted from a digital whiteboard. Extract ALL actionable tasks, to-dos, and assignments. Format them strictly as a clean Markdown checklist. Do not include unnecessary chatter.

Whiteboard Data:
${boardText}`;
    }

    // 5. Call the AI!
    const result = await model.generateContent(systemPrompt);
    const aiResponse = result.response.text();

    return NextResponse.json({ result: aiResponse });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response. Please try again." },
      { status: 500 }
    );
  }
}