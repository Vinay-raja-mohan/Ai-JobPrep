import { NextResponse } from "next/server";
import { getGeminiModel, generateContentWithRetry } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { skills, interests, workStyle } = await req.json();

    if (!skills || !interests || !workStyle) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const apiKey = req.headers.get("x-gemini-api-key") || undefined;
    const model = getGeminiModel(apiKey);

    const prompt = `
      You are an expert career counselor specializing in the Indian tech ecosystem.
      A user has provided the following profile:
      - Skills: ${skills}
      - Interests: ${interests}
      - Preferred Work Environment: ${workStyle}

      Based on this profile, suggest 3 to 5 highly relevant tech-related job roles that have high hiring volume in India (e.g., Service-based IT, Product-based, GCCs, Startups).
      For each role, suggest a 'coreSkill' that the user should focus on for this role (e.g. 'React/Next.js', 'Python/Django', 'Java/Spring', 'Data Science', 'Cloud/DevOps').

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
    const data = JSON.parse(jsonStr);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Discovery API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate career suggestions" },
      { status: 500 }
    );
  }
}
