import { useState, useRef } from "react";
import useAutoScroll from "./hooks/useAutoScroll";
import MessageRow from "./components/MessageRow";
import "./App.css";

export default function App() {
  const [started, setStarted]     = useState(false);
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [pendingUpload, setPendingUpload] = useState(null);   // File object
  const fileInputRef              = useRef(null);

  const endRef = useAutoScroll([messages]);

  /* ---------------- helpers ---------------- */
  const push = (msg) => setMessages((m) => [...m, msg]);
  const replaceLast = (msg) =>
    setMessages((m) => [...m.slice(0, -1), msg]);

  /* ---------------- send flow ---------------- */
  const handleSend = () => {
    if (!input.trim() && !pendingUpload) return;
    if (!started) setStarted(true);

    const userMsg = {
      role: "user",
      content: input.trim() || "📷 Image",
      image: pendingUpload,
    };
    push(userMsg);
    setInput("");
    setPendingUpload(null);

    // bot typing indicator
    push({ role: "bot", typing: true });

    // *** call your real API here ***
    setTimeout(() => {
      replaceLast({
        role: "bot",
        content: `You said: “${userMsg.content}”. Here’s a mock audit.`,
      });
    }, 700);
  };

  /* -------------- UI elements -------------- */
  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();   // keep focus in input
      handleSend();
    }
  };

  const pickImage = () => fileInputRef.current.click();
  const onFile = (e) => setPendingUpload(URL.createObjectURL(e.target.files[0]));

  /* -------------- render -------------- */
  return (
    <div className="app">
      <header className="header"><h1>ChatGPT o4-mini-high</h1></header>

      {!started ? (
        /* WELCOME */
        <div className="welcome text-center">
          <h2>Ready when you are.</h2>
          <div className="input welcome-input">
            <button className="icon-btn" onClick={pickImage}>＋</button>
            <input
              className="welcome-input-box"
              placeholder="Ask anything"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="icon-btn">🎤</button>
            <button type="button" className="send-btn" onClick={handleSend}>➤</button>
          </div>
        </div>
      ) : (
        /* CHAT */
        <>
          <main className="chat" style={{ marginInline: "30%" }}>
            {messages.map((m, i) => (
              <MessageRow key={i} {...m} />
            ))}
            {pendingUpload && (
              <MessageRow role="user" image={pendingUpload} />
            )}
            <div ref={endRef} />
          </main>

          <footer className="input-bar">
            <div className="input-container" style={{ marginInline: "30%" }}>
              <button className="icon-btn" onClick={pickImage}>＋</button>
              <input
                placeholder="Ask anything"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
              />
              <button className="icon-btn">🎤</button>
              <button type="button" className="send-btn" onClick={handleSend}>➤</button>
            </div>
          </footer>
        </>
      )}

      {/* hidden file field */}
      <input
        type="file"
        accept="image/*"
        hidden
        ref={fileInputRef}
        onChange={onFile}
      />
    </div>
  );
}
