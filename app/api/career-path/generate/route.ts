import { NextResponse } from "next/server";
import { generateContentWithRetry } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { educationStage, targetRole, coreSkill } = body;
    const apiKey = req.headers.get("x-gemini-api-key") || undefined;

    if (!targetRole) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `
      You are an expert career counselor. A student is currently at the following education stage: "${educationStage || 'Unknown'}".
      Their ultimate career goal is to become a "${targetRole}". 
      Their core interest/skill area is "${coreSkill || 'Not specified'}".

      Generate a high-level, step-by-step educational and career path for them to reach this goal.
      The path should include 4 to 6 major milestones.
      For example, if a 10th-grade student wants to be a Software Engineer, the path might be:
      10th Grade -> Intermediate MPC -> B.Tech in Computer Science -> Software Engineering Intern -> Software Engineer.

      If the path is for a Doctor:
      10th Grade -> Intermediate BiPC (NEET Prep) -> MBBS Degree -> Medical Internship -> Practicing Doctor.

      Provide the response strictly as a JSON object matching this schema:
      {
        "title": "A catchy title for the path, e.g., 'The Road to Software Engineering'",
        "description": "A short, encouraging paragraph summarizing the journey.",
        "currentStepNumber": 1, // The step number that represents where the user currently is, based on their educationStage.
        "steps": [
          {
            "stepNumber": 1,
            "title": "Short title of the milestone (e.g., '10th Board Exams')",
            "description": "Brief description of what to focus on during this stage (e.g., 'Focus on Math and Science').",
            "duration": "e.g., '1 Year' or '2 Years'"
          }
        ]
      }
      Only return valid JSON, no markdown formatting blocks.
    `;

    let rawText = await generateContentWithRetry(prompt, apiKey);
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let pathData;
    try {
      pathData = JSON.parse(rawText);
    } catch (e) {
      console.error("Failed to parse JSON:", rawText);
      throw new Error("Failed to parse AI response as JSON");
    }

    return NextResponse.json({ path: pathData });

  } catch (error: any) {
    console.error("Career Path Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate career path" }, { status: 500 });
  }
}
