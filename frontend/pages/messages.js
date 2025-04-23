import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

export default function MessagesPage() {
  const router = useRouter();
  const { to } = router.query;

  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [user, setUser] = useState(null);
  const [online, setOnline] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  const socketRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then((u) => {
          setUser(u);

          socketRef.current = io({ path: "/api/socket_io" });

          socketRef.current.emit("join", u._id);
          socketRef.current.emit("online", u._id);

          socketRef.current.on("onlineUsers", setOnline);

          socketRef.current.on("message", (msg) => {
            setChats((prev) =>
                prev.map((chat) => {
                  const match =
                      chat._id === msg.room ||
                      chat.participants?.some((p) => p._id === msg.sender);
                  if (match) {
                    return {
                      ...chat,
                      messages: [...(chat.messages || []), msg],
                    };
                  }
                  return chat;
                })
            );

            if (
                selected &&
                (selected._id === msg.room ||
                    selected.participants?.some((p) => p._id === msg.sender))
            ) {
              setSelected((prev) => ({
                ...prev,
                messages: [...(prev.messages || []), msg],
              }));
            }
          });

          socketRef.current.on("typing", (payload) => {
            setTypingUser(payload.sender);
            clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => setTypingUser(null), 2000);
          });
        });

    fetch(`${process.env.NEXT_PUBLIC_API}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then(setChats);

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (to && chats.length > 0) {
      const existing = chats.find((chat) =>
          chat.participants?.some((p) => p._id === to)
      );
      if (existing) {
        setSelected(existing);
      }
    }
  }, [to, chats]);

  const sendMessage = () => {
    if (!newMsg.trim() || !selected || !user) return;

    const receiver =
        selected.participants.find((p) => p._id !== user._id)?._id || selected._id;

    const msg = {
      room: receiver,
      sender: user._id,
      receiver,
      text: newMsg,
      timestamp: new Date().toISOString(),
    };

    socketRef.current?.emit("message", msg);

    setSelected((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), msg],
    }));

    setNewMsg("");
  };

  const handleTyping = (e) => {
    setNewMsg(e.target.value);
    const receiver =
        selected?.participants?.find((p) => p._id !== user?._id)?._id;
    if (receiver) {
      socketRef.current?.emit("typing", {
        sender: user._id,
        room: receiver,
      });
    }
  };

  return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex gap-6">
        {/* Chat List */}
        <div className="w-1/3 space-y-3">
          <h2 className="text-xl font-semibold mb-3">Chats</h2>
          {chats.map((chat) => {
            const chatUser = chat.participants?.find((p) => p._id !== user?._id);
            const isOnline = chatUser && online.includes(chatUser._id);

            return (
                <div
                    key={chat._id}
                    onClick={() => setSelected(chat)}
                    className={`p-3 rounded-xl cursor-pointer hover:bg-gray-700 ${
                        selected?._id === chat._id ? "bg-gray-800" : "bg-gray-700"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{chatUser?.name || chat.name}</span>
                    {isOnline && <span className="text-green-400 text-xs">●</span>}
                  </div>
                </div>
            );
          })}
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-xl font-semibold mb-3">
            {selected?.name ||
                selected?.participants?.find((p) => p._id !== user?._id)?.name ||
                "Select chat"}
          </h2>

          <div className="flex-1 bg-gray-800 p-4 rounded-xl mb-4 overflow-y-auto space-y-2">
            {(selected?.messages || []).map((msg, i) => (
                <div
                    key={i}
                    className={`p-2 rounded max-w-xs ${
                        msg.sender === user?._id
                            ? "bg-teal-600 ml-auto text-white"
                            : "bg-gray-700"
                    }`}
                >
                  {msg.text}
                </div>
            ))}

            {typingUser &&
                typingUser !== user?._id &&
                selected?.participants?.some((p) => p._id === typingUser) && (
                    <div className="text-sm text-gray-400">typing...</div>
                )}
          </div>

          {selected && (
              <div className="flex gap-2">
                <input
                    type="text"
                    value={newMsg}
                    onChange={handleTyping}
                    placeholder="Type a message..."
                    className="flex-1 p-3 text-black rounded"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage();
                    }}
                />
                <button
                    onClick={sendMessage}
                    className="bg-teal-400 text-black px-4 py-2 rounded hover:bg-teal-300"
                >
                  Send
                </button>
              </div>
          )}
        </div>
      </div>
  );
}
