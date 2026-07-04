import { NextResponse } from "next/server";
import { getGeminiModel, generateContentWithRetry } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { skills, interests, workStyle, educationStage } = await req.json();

    if (!skills || !interests || !workStyle || !educationStage) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const apiKey = req.headers.get("x-gemini-api-key") || undefined;
    const model = getGeminiModel(apiKey);

    const isSchoolLevel = ["9th", "10th", "Intermediate"].includes(educationStage);

    const prompt = `
      You are an expert career counselor specializing in the Indian education and job ecosystem.
      A user has provided the following profile:
      - Current Education Stage: ${educationStage}
      - ${isSchoolLevel ? "Favorite Subjects" : "Skills"}: ${skills}
      - Interests: ${interests}
      - Preferred Environment/Future Goal: ${workStyle}

      Based on this profile, suggest 3 to 5 highly relevant future career paths (e.g., if they are in 9th grade, suggest paths like AI Researcher, Doctor, Mechanical Engineer, Architect, etc. If they are in B.Tech, suggest specific IT/Core roles).
      For each role, suggest a 'coreSkill' or core focus area that the user should focus on for this role (e.g. 'Mathematics/Physics', 'Biology', 'React/Next.js', 'Mechanical Design').

      Return the response STRICTLY as a JSON object with the following structure:
      {
        "suggestions": [
          {
            "jobTitle": "Job Title (e.g., Frontend Engineer, Data Analyst, DevRel)",
            "matchPercentage": 95,
            "whyItFits": "A brief, 1-2 sentence explanation of why this fits their specific skills and interests, including typical salary expectations in INR or tier of companies.",
            "coreSkill": "The primary tech stack / skill to focus on (e.g., React/Next.js, Python, Java)"
          }
        ]
      }
      
      CRITICAL: Return ONLY valid JSON, no markdown blocks around it.
    `;

    const text = await generateContentWithRetry(prompt, apiKey);

    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    let data;
    try {
      data = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Discovery API JSON Parse Error. Raw Text:", text);
      return NextResponse.json(
        { error: "AI returned invalid format. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Discovery API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate career suggestions" },
      { status: 500 }
    );
  }
}
