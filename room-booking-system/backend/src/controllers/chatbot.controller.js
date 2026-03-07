import { generateGeminiReply } from "../services/gemini.service.js";

export const chatbotHandler = async (req, res) => {
  try {
    // Safe destructuring
    const message = req.body?.message;
    const history = req.body?.history || [];

    // Validate message
    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        reply: "Please provide a valid message.",
      });
    }

    // Call Gemini service
    const reply = await generateGeminiReply(message, history);

    // Return response
    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Chatbot error:", error);

    res.status(500).json({
      success: false,
      reply:
        "⚠️ Our AI concierge is temporarily unavailable. Please try again later or contact support.",
    });
  }
};