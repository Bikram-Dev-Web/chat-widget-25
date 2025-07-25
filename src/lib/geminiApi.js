// src/geminiApi.js
export async function getGeminiResponse(userMessage) {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";


    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userMessage }],
          },
        ],
      }),
    });

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return reply || "Sorry, I couldn't understand that.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "There was an error connecting to the AI.";
  }
}
