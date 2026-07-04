import { generateRoadmap } from "./lib/gemini.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const profile = {
  educationStage: "10th",
  targetRole: "Nutritionist",
  coreSkill: "Nutrition & Diet",
  currentLevel: "Beginner",
  dailyStudyTime: 60,
  goalTimeline: "3 months"
};

async function run() {
  try {
    const res = await generateRoadmap(profile, process.env.GEMINI_API_KEY);
    console.log("SUCCESS:", JSON.stringify(res, null, 2).substring(0, 500));
  } catch (err) {
    console.error("ERROR:", err);
  }
}
run();
