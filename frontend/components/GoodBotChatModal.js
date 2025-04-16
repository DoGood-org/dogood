// GoodBotChatModal.js — with language selection
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

export default function GoodBotChatModal({ onClose }) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en");

  const sendMessage = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/goodbot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, lang })
      });
      const data = await res.json();
      setResponse(data.message || "No response received.");
    } catch (err) {
      setResponse("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur z-[2000] flex items-center justify-center">
        <motion.div
            className="bg-white text-black rounded-xl p-6 max-w-lg w-full relative shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
        >
          <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <img src="/goodbot.png" alt="GoodBot" className="w-10 h-10 rounded-full" />
            <h2 className="text-2xl font-bold">GoodBot Assistant</h2>
          </div>

          <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="mb-4 p-2 rounded text-black border"
          >
            <option value="en">English</option>
            <option value="ua">Українська</option>
          </select>

          <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask anything about helping, finding tasks or using the map..."
              className="w-full p-3 border border-gray-300 rounded text-black mb-3"
          ></textarea>

          <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Send"}
          </button>

          <div className="mt-4 min-h-[100px] bg-gray-100 p-3 rounded">
            {loading && <LoadingSpinner />}
            <AnimatePresence>
              {!loading && response && (
                  <motion.div
                      key="response"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                  >
                    {response}
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
  );
}
