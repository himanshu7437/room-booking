import { useState } from "react";
import axios from "axios";

export function useGeminiChat() {
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message, history) => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/chatbot`,
        {
          message,
          history,
        }
      );

      return res.data.reply;
    } catch (err) {
      console.error(err);

      return "⚠️ I'm having trouble connecting to our AI concierge right now.\n\nYou can still explore rooms or contact our team for assistance.";
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
}