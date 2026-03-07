import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { useGeminiChat } from "./useGeminiChat";

export default function ConciergeBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      message:
        "Welcome to LuxStay! I'm your AI concierge. How can I help you today?",
    },
  ]);

  const { sendMessage, loading } = useGeminiChat();
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const handleSend = async () => {
  if (!input.trim()) return;

  const userMsg = input;

  const updatedMessages = [
    ...messages,
    { role: "user", message: userMsg },
  ];

  setMessages(updatedMessages);
  setInput("");

  // Convert to Gemini format
  const history = updatedMessages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.message }],
  }));

  const reply = await sendMessage(userMsg, history);

  setMessages((prev) => [...prev, { role: "bot", message: reply }]);
};

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-yellow-400 to-amber-500 p-4 rounded-full shadow-lg hover:scale-105 transition"
        >
          <MessageCircle className="text-black" />
        </button>
      )}

      {open && (
        <div className="w-80 h-[420px] bg-[#0f0f0f] border border-white/10 rounded-xl shadow-xl flex flex-col overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <p className="text-sm font-semibold text-white">
              LuxStay Concierge
            </p>

            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <ChatMessage key={i} role={m.role} message={m.message} />
            ))}

            {loading && <TypingIndicator />}

            <div ref={bottomRef}></div>
          </div>

          {/* input */}
          <div className="border-t border-white/10 p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about rooms, events..."
              className="flex-1 bg-[#151515] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />

            <button
              onClick={handleSend}
              className="bg-yellow-500 p-2 rounded-lg text-black hover:bg-yellow-400"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}