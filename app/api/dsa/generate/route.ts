import { NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { DSAProblem } from "@/models/DSAProblem";

export async function POST(req: Request) {
  try {
    const { topic, email, force } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    await dbConnect();

    // 1. Find User (if email provided)
    let user = null;
    if (email) {
      user = await User.findOne({ email });
    }

    // 2. Check for existing problem (if user exists and not forcing new)
    if (user && !force) {
      const existingProblem = await DSAProblem.findOne({ userId: user._id, topic });
      if (existingProblem) {
        return NextResponse.json(existingProblem.problem);
      }
    }

    // 3. Generate New Problem
    const prompt = `
    Generate a unique Coding Interview Problem about "${topic}".
    Difficulty: Medium.
    
    Output strictly valid JSON:
    {
      "title": "Problem Title",
      "difficulty": "Medium",
      "description": "Clear problem statement...",
      "examples": [
        "Input: [1,2,3] -> Output: [1,3,2]",
        "Input: [] -> Output: []"
      ],
      "hint": "One sentence hint.",
      "starterCode": "// function solve(arr) { ... }"
    }
    `;

    const apiKey = req.headers.get("x-gemini-api-key") || undefined;
    const model = getGeminiModel(apiKey);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const problemData = JSON.parse(jsonStr);

    // 4. Save to DB (if user exists)
    if (user) {
      await DSAProblem.findOneAndUpdate(
        { userId: user._id, topic },
        {
          userId: user._id,
          topic,
          problem: problemData,
          createdAt: new Date()
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json(problemData);

  } catch (error) {
    console.error("DSA Gen Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
