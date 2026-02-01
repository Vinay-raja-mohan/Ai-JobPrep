
const apiKey = "AIzaSyBoLU1iE7-rse7azkjZEL-1JuiscfWLyZ8";
const models = ["gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-1.5-flash-002", "gemini-2.5-flash", "gemini-2.0-flash-exp"];

async function test() {
  for (const m of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
      });
      console.log(`Model: ${m} -> Status: ${res.status}`);
    } catch (e) {
      console.log(`Model: ${m} -> Error`);
    }
  }
}
test();
