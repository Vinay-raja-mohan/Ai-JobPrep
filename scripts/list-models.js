const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBoLU1iE7-rse7azkjZEL-1JuiscfWLyZ8"; // fallback to script key
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await response.json();
  if (data.models) {
    data.models.forEach(m => console.log(m.name));
  } else {
    console.log(data);
  }
}
run();
