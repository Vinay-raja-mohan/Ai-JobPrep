import { NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { currentObjective, jobDescription } = await req.json();

    if (!currentObjective) {
      return NextResponse.json({ error: "Objective is required" }, { status: 400 });
    }

    const prompt = `
      You are an expert Resume Editor.
      
      Task: Rewrite the following "Career Objective" to be more professional, impactful, and grammatically perfect.
      
      Current Objective:
      "${currentObjective}"
      
      ${jobDescription ? `Context (Job Description): "${jobDescription.substring(0, 300)}..."` : ""}
      
      Instructions:
      - Fix any grammar or spelling errors.
      - Make it sound confident and action-oriented.
      - Keep it concise (under 3-4 sentences).
      ${jobDescription ? "- Align it slightly with the Job Description context." : ""}
      - RETURN ONLY THE REWRITTEN TEXT. No "Here is the rewritten version:" preamble.
    `;

    const apiKey = req.headers.get("x-gemini-api-key") || undefined;
    const model = getGeminiModel(apiKey);
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    return NextResponse.json({ improvedObjective: text });

  } catch (error: any) {
    console.error("Objective Improvement Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to improve objective" },
      { status: 500 }
    );
  }
}
