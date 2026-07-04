
import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGeminiModel(apiKey?: string) {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("No API Key provided. Please set GEMINI_API_KEY env var or pass it dynamically.");
  }
  const genAI = new GoogleGenerativeAI(key);
  // Reverting to gemini-2.5-flash as requested by the user, and it's the valid model for this key
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

export async function generateContentWithRetry(prompt: string, apiKey?: string, maxRetries = 2) {
  const model = getGeminiModel(apiKey);
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      if (error.message?.includes("503") && i < maxRetries) {
        console.log(`503 Service Unavailable on try ${i+1}. Retrying in ${i + 1}s...`);
        await new Promise(resolve => setTimeout(resolve, (i + 1) * 1000));
        continue;
      }
      if (error.message?.includes("429")) {
        throw new Error("API Rate Limit Exceeded. Please wait 15 seconds and try again.");
      }
      throw error;
    }
  }
  throw new Error("Failed to generate content after retries");
}


export interface UserProfile {
  educationStage?: string;
  targetRole: string;
  coreSkill: string;
  currentLevel: string;
  dailyStudyTime: number;
  goalTimeline: string;
}

export async function generateRoadmap(profile: UserProfile, apiKey?: string) {
  // We limit to 1 month for now to avoid token limits, or we use 1.5-flash which handles more.
  // Let's ask for the full timeline but keep descriptions concise.
  const techKeywords = ["developer", "engineer", "software", "programmer", "data", "cloud", "devops", "it", "web", "app", "cyber", "ai", "machine", "tech", "react", "python", "full stack", "frontend", "backend", "analytics"];
  const isTechRole = !profile.targetRole || techKeywords.some(kw => profile.targetRole.toLowerCase().includes(kw));
  const isSchoolLevel = ["9th", "10th", "Intermediate"].includes(profile.educationStage || "");
  const skipTechPrep = isSchoolLevel || !isTechRole;

  const prompt = `
    Create a complete study roadmap for a "${profile.targetRole}" (Level: ${profile.currentLevel}).
    Focus: ${profile.coreSkill}. Time: ${profile.dailyStudyTime} min/day. Total Duration: ${profile.goalTimeline}.
    Education Stage: ${profile.educationStage || "B.Tech/Degree"}
    
    IMPORTANT: You must generate a roadmap for the ENTIRE duration (${profile.goalTimeline}). 
    If 3 months, generate 3 months. If 6 months, generate 6 months. Check the line IMPORTANT and generate the roadmap for the given duration.

    ${skipTechPrep ? `
    STRICT SYLLABUS:
    Since this user is in school or pursuing a non-IT role (${profile.targetRole}), DO NOT include DSA (Data Structures & Algorithms) or corporate IT Aptitude.
    Focus strictly on their foundational learning for "${profile.targetRole}" and core subjects:
    1. CORE SKILL: Specific to "${profile.coreSkill}".
    2. FOUNDATION: Relevant domain knowledge, case studies, or general skills for their path.
    
    Set "aptitudeTask" to "None - Focus on core task."
    Set "dsaTask" to "None - Focus on core task."
    ` : `
    STRICT SYLLABUS (Select topics from here):
    
    1. APTITUDE (Arithmetic & Reasoning):
       - Arithmetic: Time & Distance, Percentages, SI/CI, Profit & Loss, Partnership, Ratio & Proportion, Time & Work, Averages, Mixture & Alligation.
       - Reasoning: Number Series, Coding & Decoding, Directions, Seating Arrangement, Blood Relations, Clocks, Calendars, Counting Figures, Mirror Images, Charts, Simplifications.
    
    2. DSA (Data Structures & Algorithms):
       - Basics, Sorting (Bubble/Merge/Quick), Arrays, Binary Search, Strings, Linked Lists, Recursion, Bit Manipulation, Stack & Queue, Sliding Window, Heaps, Greedy, Trees, BST, Graphs, DP, Tries.

    3. CORE SKILL:
       - Specific to "${profile.coreSkill}" (e.g. if Python -> Syntax, OOPs, Django, etc).
    `}

    Ensure:
    ${skipTechPrep ? `
    - "aptitudeTask": Must literally be "None - Focus on core task."
    - "dsaTask": Must literally be "None - Focus on core task."
    - "coreTask": Specific to ${profile.coreSkill}.
    ` : `
    - "aptitudeTask": Must be from the APTITUDE list above. (NOT Code).
    - "dsaTask": Must be from the DSA list above.
    - "coreTask": Specific to ${profile.coreSkill}.
    `}
    
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
                  "aptitudeTask": "Topic: General Aptitude / Logic / Verbal (NOT technical code)",
                  "dsaTask": "Topic: Data Structures & Algorithms",
                  "coreTask": "Topic: Core Tech Stack (e.g. React, Python)",
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
    const text = await generateContentWithRetry(prompt, apiKey);

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
