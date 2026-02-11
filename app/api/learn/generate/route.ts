
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { LearningContent } from "@/models/LearningContent";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, email, force } = body;
    const apiKey = req.headers.get("x-gemini-api-key") || process.env.GEMINI_API_KEY;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    await dbConnect();

    // 1. Identify User (if email provided)
    let user = null;
    if (email) {
      user = await User.findOne({ email });
    }

    // 2. Check Database for existing content (only if we have a user and not forcing regeneration)
    if (user && !force) {
      const existingContent = await LearningContent.findOne({ userId: user._id, topic });
      if (existingContent) {
        return NextResponse.json(existingContent.content);
      }
    }

    console.log("Generating new content for:", topic);

    if (!apiKey) {
      console.error("API Key missing");
      return NextResponse.json(
        { error: "API key not found" },
        { status: 401 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-2.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are an expert tutor. Create a comprehensive study guide for the topic: "${topic}".
    
    RETURN JSON ONLY. Do not use Markdown code blocks. Structure the response strictly as valid JSON.
    
    JSON Structure:
    {
      "title": "${topic}",
      "introduction": "Detailed introduction explaining the concept clearly (2-3 paragraphs).",
      "keyMatches": [ // 6 key sub-concepts or properties to display in a 3x2 grid
        { "title": "Sub-concept 1", "description": "Short explanation" },
        { "title": "Sub-concept 2", "description": "Short explanation" },
        { "title": "Sub-concept 3", "description": "Short explanation" },
        { "title": "Sub-concept 4", "description": "Short explanation" },
        { "title": "Sub-concept 5", "description": "Short explanation" },
        { "title": "Sub-concept 6", "description": "Short explanation" }
      ],
      "realWorldUses": [ // 3 Real-world applications to display in a 3-column grid
        { "title": "Application 1", "description": "How it is used in real life" },
        { "title": "Application 2", "description": "How it is used in real life" },
        { "title": "Application 3", "description": "How it is used in real life" }
      ],
      "callouts": [ // Important information, warnings, or tips
        { "type": "warning", "title": "Common Mistake", "content": "Description of mistake" },
        { "type": "tip", "title": "Pro Tip", "content": "Best practice advice" },
        { "type": "info", "title": "Did You Know?", "content": "Interesting fact" }
      ],
      "faq": [ // Accordion items
        { "question": "Common Question 1?", "answer": "Answer 1" },
        { "question": "Common Question 2?", "answer": "Answer 2" }
      ]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up potential markdown formatting from AI (sometimes it adds \`\`\`json)
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedContent = JSON.parse(jsonStr);

    // 3. Save to Database (if user exists)
    if (user) {
      await LearningContent.findOneAndUpdate(
        { userId: user._id, topic },
        {
          userId: user._id,
          topic,
          content: parsedContent,
          createdAt: new Date()
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json(parsedContent);
  } catch (error: any) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate content", details: error },
      { status: 500 }
    );
  }
}
