// ChatBox.js — simple user chat UI with local mock messages
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function ChatBox({ onClose, partner = "User" }) {
  const [messages, setMessages] = useState([
    { sender: "them", text: "Hi! How can I help you?" },
    { sender: "me", text: "I’m interested in your volunteering event." },
  ]);
  const [newMsg, setNewMsg] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    setMessages([...messages, { sender: "me", text: newMsg }]);
    setNewMsg("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-4 right-4 w-full max-w-sm bg-white text-black rounded-xl shadow-lg overflow-hidden z-[2000]"
    >
      <div className="bg-teal-600 text-white flex justify-between items-center px-4 py-2">
        <h3 className="font-semibold">Chat with {partner}</h3>
        <button onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div
        ref={containerRef}
        className="max-h-64 overflow-y-auto p-3 space-y-2 bg-gray-50"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-3 py-2 rounded-lg text-sm shadow ${
              msg.sender === "me"
                ? "ml-auto bg-teal-100 text-right"
                : "bg-white"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-2 border-t bg-white flex gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded border"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600"
        >
          Send
        </button>
      </div>
    </motion.div>
  );
}
