// src/App.jsx
import { useState, useRef } from "react";
import useAutoScroll from "./hooks/useAutoScroll";
import MessageRow from "./components/MessageRow";
import { chat } from "./api/chat";     // ← import the real API call
import "./App.css";

export default function App() {
  const [started, setStarted]               = useState(false);
  const [messages, setMessages]             = useState([]);
  const [input, setInput]                   = useState("");
  const [pendingUploadFile, setPendingUploadFile]     = useState(null); // the File
  const [pendingUploadPreview, setPendingUploadPreview] = useState(null); // URL for preview
  const fileInputRef                        = useRef(null);

  const endRef = useAutoScroll([messages]);

  /* ---------------- message helpers ---------------- */
  const push = (msg) => setMessages((m) => [...m, msg]);
  const replaceLast = (msg) =>
    setMessages((m) => [...m.slice(0, -1), msg]);

  /* ---------------- send flow ---------------- */
  const handleSend = async () => {
    if (!input.trim() && !pendingUploadFile) return;
    if (!started) setStarted(true);

    // show the user’s message (text and/or image)
    push({
      role: "user",
      content: input.trim() || null,
      image: pendingUploadPreview || null,
    });

    // clear inputs
    setInput("");
    // show typing indicator
    push({ role: "bot", typing: true });

    try {
      // call the HF-backed audit API
      const audit = await chat({
        text: input.trim(),
        image: pendingUploadFile,
      });

      // replace typing indicator with structured JSON
      replaceLast({
        role: "bot",
        content: JSON.stringify(audit, null, 2),
      });
    } catch (err) {
      replaceLast({
        role: "bot",
        content: `Error: ${err.message}`,
      });
    } finally {
      // reset upload state
      setPendingUploadFile(null);
      setPendingUploadPreview(null);
    }
  };

  /* ---------------- UI event handlers ---------------- */
  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const pickImage = () => fileInputRef.current.click();
  const onFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPendingUploadFile(file);
    setPendingUploadPreview(URL.createObjectURL(file));
  };

  /* ---------------- render ---------------- */
  return (
    <div className="app">
      <header className="header">
        <h1>Social Media Audit Chat</h1>
      </header>

      {!started ? (
        /* WELCOME SCREEN */
        <div className="welcome text-center">
          <h2>Ready when you are.</h2>
          <div className="input welcome-input">
            <button className="icon-btn" onClick={pickImage}>＋</button>
            <input
              className="welcome-input-box"
              placeholder="Ask anything or upload an image"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="icon-btn">🎤</button>
            <button
              type="button"
              className="send-btn"
              onClick={handleSend}
            >
              ➤
            </button>
          </div>
        </div>
      ) : (
        /* CHAT SCREEN */
        <>
          <main className="chat" style={{ marginInline: "30%" }}>
            {messages.map((m, i) => (
              <MessageRow key={i} {...m} />
            ))}
            <div ref={endRef} />
          </main>

          <footer className="input-bar">
            <div
              className="input-container"
              style={{ marginInline: "30%" }}
            >
              <button className="icon-btn" onClick={pickImage}>＋</button>
              <input
                placeholder="Ask anything or upload an image"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
              />
              <button className="icon-btn">🎤</button>
              <button
                type="button"
                className="send-btn"
                onClick={handleSend}
              >
                ➤
              </button>
            </div>
          </footer>
        </>
      )}

      {/* Hidden file input for uploads */}
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
