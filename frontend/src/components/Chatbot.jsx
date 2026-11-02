import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../services/aiService";

const QUICK = [
  "Best study techniques?",
  "Top CS careers in 2026?",
  "How to improve GPA?",
  "Recommend online courses",
];

/**
 * Chatbot — floating AI assistant with quick prompts and full chat UI.
 */
const Chatbot = () => {
  const [open, setOpen]         = useState(false);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I'm EduBot 🎓 — your AI academic assistant. Ask me anything about courses, study tips, or career advice!",
    },
  ]);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    setMessages((p) => [...p, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage(msg);
      setMessages((p) => [...p, { role: "ai", text: res.data.reply }]);
    } catch {
      setMessages((p) => [...p, { role: "ai", text: "⚠️ Something went wrong. Check your API key." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 flex flex-col rounded-2xl overflow-hidden shadow-2xl slide-in-right"
          style={{
            background: "rgba(8, 12, 22, 0.97)",
            border: "1px solid rgba(99,102,241,0.25)",
            height: "420px",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center gap-3 border-b"
            style={{
              borderColor: "rgba(99,102,241,0.15)",
              background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))",
            }}
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-base float">
                🤖
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2" style={{ borderColor: "#08091a" }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                EduBot
              </p>
              <p className="text-xs" style={{ color: "#10b981" }}>● Online</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition text-xs"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} fade-in-up`}
              >
                {msg.role === "ai" && (
                  <div
                    className="w-6 h-6 rounded-lg shrink-0 mr-2 flex items-center justify-center text-xs"
                    style={{ background: "rgba(99,102,241,0.2)" }}
                  >
                    🤖
                  </div>
                )}
                <div
                  className="max-w-[80%] text-xs leading-relaxed px-3 py-2 rounded-xl"
                  style={
                    msg.role === "user"
                      ? {
                          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                          color: "white",
                          borderRadius: "12px 12px 2px 12px",
                        }
                      : {
                          background: "rgba(255,255,255,0.05)",
                          color: "#d1d5db",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "2px 12px 12px 12px",
                        }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-center gap-2 fade-in-up">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                  style={{ background: "rgba(99,102,241,0.2)" }}
                >
                  🤖
                </div>
                <div
                  className="px-3 py-2 rounded-xl flex items-center gap-1"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "#6366f1",
                        animation: `pulse 1.4s ease-in-out ${delay}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick prompts — show only if 1 message */}
          {messages.length === 1 && (
            <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-xs px-2.5 py-1 rounded-full transition"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    color: "#a5b4fc",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            className="p-3 border-t flex gap-2"
            style={{ borderColor: "rgba(99,102,241,0.15)" }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask EduBot..."
              className="flex-1 px-3 py-2 rounded-lg text-xs outline-none transition"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(99,102,241,0.2)",
                color: "#f0f2ff",
              }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              ↑
            </button>
          </div>
        </div>
      )}

      {/* Floating trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl transition-all duration-200 glow-indigo"
        style={{
          background: open
            ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
            : "linear-gradient(135deg, #6366f1, #8b5cf6)",
          boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
          transform: open ? "rotate(10deg)" : "rotate(0deg)",
        }}
      >
        {open ? "✕" : "🤖"}
      </button>
    </>
  );
};

export default Chatbot;
