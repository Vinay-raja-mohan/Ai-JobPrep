
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import path from "path";

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Testing with API Key:", apiKey ? "FOUND (" + apiKey.substring(0, 5) + "...)" : "MISSING");

  if (!apiKey) {
    throw new Error("API Key missing");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  console.log("Model initialized: gemini-1.5-flash");

  const prompt = `
    Create a mini roadmap for a "React Developer" (Beginner).
    Output STRICT JSON only:
    {
        "months": [
            { "month": 1, "weeks": [] }
        ]
    }
    `;

  try {
    console.log("Sending prompt...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("--- RESPONSE ---");
    console.log(text);
    console.log("----------------");

  } catch (error) {
    console.error("Error calling Gemini:", error);
  }
}

testGemini();
