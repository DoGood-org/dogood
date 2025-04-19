import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import axios from "axios";
import io from "socket.io-client";
import { useDebounce } from "use-debounce";

export default function ChatBox({ onClose, userId, partnerId, partnerName = "User" }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [debouncedMsg] = useDebounce(newMsg, 300);
  const containerRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    socketRef.current = io({ path: '/api/socket_io' });
    const room = [userId, partnerId].sort().join('-');
    socketRef.current.emit('join', room);

    socketRef.current.on('message', (msg) => {
      if ((msg.sender === partnerId && msg.receiver === userId) ||
          (msg.sender === userId && msg.receiver === partnerId)) {
        setMessages((prev) => [...prev, msg]);
        if (typeof window !== 'undefined' && document.visibilityState !== 'visible' && msg.sender !== userId && Notification.permission === 'granted') {
          new Notification(`New message from ${partnerName}`, {
            body: msg.content,
            icon: "/logo.png"
          });
        }
      }
    });

    socketRef.current.on("typing", ({ user }) => {
      if (user !== userId) {
        setTypingUser(user);
        setTimeout(() => setTypingUser(null), 1500);
      }
    });

    socketRef.current.on("onlineUsers", setOnlineUsers);
    socketRef.current.emit("online", userId);

    return () => { socketRef.current.disconnect(); };
  }, [userId, partnerId]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    const message = {
      sender: userId,
      receiver: partnerId,
      content: newMsg,
      type: "text"
    };
    try {
      const res = await axios.post("/api/messages/send", message);
      setMessages([...messages, res.data]);
      socketRef.current.emit('message', { ...res.data, room: [userId, partnerId].sort().join('-') });
      setNewMsg("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
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
          <h3 className="font-semibold">
            Chat with {partnerName}
            <span className="ml-2 text-xs font-light italic">[{onlineUsers.includes(partnerId) ? "online" : "offline"}]</span>
          </h3>
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
                      msg.sender === userId
                          ? "ml-auto bg-teal-100 text-right"
                          : "bg-white"
                  }`}
              >
                {msg.content}
              </div>
          ))}
        </div>

        {typingUser && (
            <div className="px-4 py-1 text-xs text-gray-500">{partnerName} is typing...</div>
        )}

        <div className="p-2 border-t bg-white flex gap-2">
          <input
              type="text"
              value={newMsg}
              onChange={(e) => {
                setNewMsg(e.target.value);
                socketRef.current.emit('typing', {
                  room: [userId, partnerId].sort().join('-'),
                  user: userId
                });
              }}
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
