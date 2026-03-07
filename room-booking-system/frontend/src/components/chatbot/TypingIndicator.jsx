export default function TypingIndicator() {
  return (
    <div className="text-gray-400 text-sm flex gap-1">
      <span className="animate-bounce">•</span>
      <span className="animate-bounce delay-100">•</span>
      <span className="animate-bounce delay-200">•</span>
    </div>
  );
}