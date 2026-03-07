import ReactMarkdown from "react-markdown";

export default function ChatMessage({ message, role }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-3 rounded-xl text-sm ${
          isUser
            ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black"
            : "bg-[#151515] border border-white/10 text-gray-300"
        }`}
      > 
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-2">{children}</p>,
            li: ({ children }) => (
              <li className="ml-4 list-disc text-gray-300">{children}</li>
            ),
            strong: ({ children }) => (
              <span className="font-semibold text-white">{children}</span>
            ),
          }}
        >
          {message}
        </ReactMarkdown>
      </div>
    </div>
  );
}