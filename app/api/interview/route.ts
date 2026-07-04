import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { generateContentWithRetry } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { email, currentAnswer, history } = await req.json();
    const apiKey = req.headers.get("x-gemini-api-key") || process.env.GEMINI_API_KEY;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const role = user.targetRole || "Software Developer";
    const skill = user.coreSkill || "General";
    const level = user.currentLevel || "Beginner";

    let prompt = "";

    if (!history || history.length === 0) {
      // Start of interview
      prompt = `
      You are an expert technical interviewer at a top tech company. 
      You are interviewing a candidate for a "${role}" position (Level: ${level}, Core Skill: ${skill}).
      
      Generate the FIRST interview question. It should be a welcoming behavioral or introductory technical question.
      
      RETURN ONLY VALID JSON WITH EXACTLY THIS STRUCTURE:
      {
        "feedback": null,
        "score": null,
        "nextQuestion": "Your question here...",
        "isComplete": false
      }
      Do not include markdown blocks (\`\`\`json) or any other text.
      `;
    } else {
      // Mid-interview
      const isLastQuestion = history.length >= 8; // End interview after ~4 exchanges (8 messages)

      prompt = `
      You are an expert technical interviewer at a top tech company.
      You are interviewing a candidate for a "${role}" position (Level: ${level}, Core Skill: ${skill}).
      
      Conversation History:
      ${history.map((msg: any) => `${msg.role === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.content}`).join("\n")}
      
      Candidate's Latest Answer:
      "${currentAnswer}"
      
      Evaluate their latest answer. 
      - Provide constructive feedback (what was good, what to improve).
      - Give a score out of 10.
      - If the interview is NOT complete, ask the next question (make it progressively harder, alternating between behavioral, conceptual, and problem-solving).
      - If the interview IS complete, provide a final closing statement instead of a question.
      
      This is question ${Math.floor(history.length / 2) + 1}. We want to stop at question 4.
      Is it complete? ${isLastQuestion ? "YES" : "NO"}.
      
      RETURN ONLY VALID JSON WITH EXACTLY THIS STRUCTURE:
      {
        "feedback": "Your constructive feedback on their answer here.",
        "score": 8,
        "nextQuestion": ${isLastQuestion ? "null" : '"Your next question here."'},
        "isComplete": ${isLastQuestion}
      }
      Do not include markdown blocks (\`\`\`json) or any other text.
      `;
    }

    const text = await generateContentWithRetry(prompt, apiKey || undefined);
    
    // Clean up JSON
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(jsonStr);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Interview API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process interview" }, { status: 500 });
  }
}
