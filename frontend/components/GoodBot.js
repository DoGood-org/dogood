import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GoodBotMessage from "./GoodBotMessage";
import LoadingSpinner from "./LoadingSpinner";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
  transports: ["websocket"]
});

const suggestions = [
  "How can I help someone today?",
  "Show me good deeds near me",
  "Give me a motivational quote",
  "How do I apply for a grant?",
  "Suggest me a volunteering task"
];

export default function GoodBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en");
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    socket.on("botMessage", (msg) => {
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
      setLoading(false);
    });

    socket.on("botTyping", () => setTyping(true));
    socket.on("stopTyping", () => setTyping(false));

    return () => {
      socket.off("botMessage");
      socket.off("botTyping");
      socket.off("stopTyping");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    socket.emit("typing");
    socket.emit("message", { prompt: input, lang });
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectSuggestion = (text) => {
    setInput(text);
    sendMessage();
  };

  return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-800">💬 GoodBot Assistant</h2>
          <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="text-sm border rounded p-1"
          >
            <option value="en">English</option>
            <option value="ua">Українська</option>
          </select>
        </div>

        <div ref={chatRef} className="h-80 overflow-y-auto space-y-2 bg-gray-100 p-3 rounded">
          {messages.map((msg, idx) => (
              <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
              >
                <GoodBotMessage role={msg.role} content={msg.content} />
              </motion.div>
          ))}
          {loading && <LoadingSpinner />}
          {typing && (
              <motion.div
                  key="typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="italic text-sm text-gray-500"
              >
                GoodBot is typing...
              </motion.div>
          )}
        </div>

        <div className="mt-3">
        <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full border p-2 rounded resize-none"
        />
          <button
              onClick={sendMessage}
              disabled={loading}
              className="mt-2 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((text, i) => (
                <button
                    key={i}
                    onClick={() => selectSuggestion(text)}
                    className="text-xs px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  {text}
                </button>
            ))}
          </div>
        </div>
      </div>
  );
}
