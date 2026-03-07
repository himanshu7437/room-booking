const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

export async function generateGeminiReply(message, history = []) {
  const context = `
You are LuxStay's AI Concierge.

LuxStay is a luxury hotel that offers:
- Premium hotel rooms
- Event hosting
- Luxury amenities
- Comfortable guest experiences

Your job:
- Greet guests warmly
- Answer general questions
- Help with rooms and events
- Guide users to booking if needed

You can also do light conversation like greetings.

Keep responses friendly, professional and concise.
`;

  try {
    const contents = [
      {
        role: "user",
        parts: [{ text: context }],
      },

      ...history,

      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await fetch(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          },
        }),
      }
    );

    const data = await response.json();

    if (!data.candidates) {
      console.error("Gemini error:", data);
      return "I'm having trouble responding right now. Please try again.";
    }

    const reply = data.candidates[0].content.parts[0].text;

    return reply;
  } catch (error) {
    console.error("Gemini API error:", error);

    return "⚠️ Our AI concierge is temporarily unavailable. Please try again later.";
  }
}