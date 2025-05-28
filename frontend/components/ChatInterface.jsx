// src/components/ChatInterface.jsx
import { useState, useRef, useEffect } from "react";

function ChatInterface({ initialMessage }) {
  const [input, setInput] = useState(initialMessage || "");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    // Simulated bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: `Structured feedback for: "${input}"\n\n✅ Use more hashtags\n✅ Improve visuals`,
        },
      ]);
    }, 700);

    setInput("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow px-4 py-3 font-bold">Audit Chat</header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xl whitespace-pre-wrap px-4 py-2 rounded-lg ${
              msg.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-white border text-gray-800"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </main>

      <footer className="bg-white p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type something..."
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </footer>
    </div>
  );
}

export default ChatInterface;
