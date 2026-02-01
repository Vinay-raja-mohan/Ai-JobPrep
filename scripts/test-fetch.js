
const apiKey = "AIzaSyBoLU1iE7-rse7azkjZEL-1JuiscfWLyZ8";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("Listing models...");

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.models) {
      console.log("--- MODEL LIST ---");
      // Filter for gemini models
      const gemini = data.models.filter(m => m.name.includes("gemini"));
      gemini.forEach(m => console.log(m.name));
      console.log("------------------");
    } else {
      console.log("Error/No models:", JSON.stringify(data));
    }
  })
  .catch(err => console.error(err));
