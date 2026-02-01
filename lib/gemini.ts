
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Use the model verified to work
export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export interface UserProfile {
  targetRole: string;
  coreSkill: string;
  currentLevel: string;
  dailyStudyTime: number;
  goalTimeline: string;
}

export async function generateRoadmap(profile: UserProfile) {
  // We limit to 1 month for now to avoid token limits, or we use 1.5-flash which handles more.
  // Let's ask for the full timeline but keep descriptions concise.
  const prompt = `
    Create a complete study roadmap for a "${profile.targetRole}" (Level: ${profile.currentLevel}).
    Focus: ${profile.coreSkill}. Time: ${profile.dailyStudyTime} min/day. Total Duration: ${profile.goalTimeline}.
    
    IMPORTANT: You must generate a roadmap for the ENTIRE duration (${profile.goalTimeline}). 
    If 3 months, generate 3 months. If 6 months, generate 6 months.
    
    Output JSON with this structure:
    {
      "months": [
        {
          "month": 1,
          "weeks": [
            {
              "week": 1,
              "theme": "Theme Name",
              "goals": ["Goal 1"],
              "dailyTasks": [ // 7 days
                {
                  "day": 1,
                  "title": "Task Title",
                  "description": "Brief description",
                  "aptitudeTask": "Topic: subtopic - activity",
                  "dsaTask": "Topic: subtopic - activity",
                  "coreTask": "Topic: subtopic - activity",
                  "resources": []
                }
              ]
            }
          ]
        }
      ]
    }
    
    CRITICAL:
    - Generate content for ALL months in the timeline.
    - KEEP STRINGS SHORT to prevent timeouts, but cover the full duration.
    - Return ONLY valid JSON.
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("--- GEMINI RAW RESPONSE ---");
    console.log(text.substring(0, 500) + "..."); // Log first 500 chars
    console.log("---------------------------");

    // Clean up markdown if present
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    // If it's a parsing error, log the invalid JSON
    if (error instanceof SyntaxError) {
      console.error("Invalid JSON received from AI");
    }
    throw new Error("Failed to generate roadmap via AI");
  }
}
