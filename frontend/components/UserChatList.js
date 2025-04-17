// components/UserChatList.js
import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import axios from "axios";
import ChatBox from "./ChatBox";

export default function UserChatList({ userId }) {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/messages/conversations", {
        params: { userId },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchUsers();
  }, [userId]);

  const handleOpenChat = async (u) => {

    useEffect(() => {
      const socket = getSocket();
      socket.on("onlineUsers", (list) => {
        setOnlineUsers(list);
      });
      return () => socket.disconnect();
    }, []);
    setSelectedUser(u);
    try {
      await axios.post("/api/messages/markRead", {
        sender: u._id,
        receiver: userId,
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to mark messages as read", err);
    }
  };

  return (
      <div className="space-y-2">
        {users.length === 0 && <p>No conversations yet.</p>}
        {users.map((u) => (
            <div
                key={u._id}
                className="p-3 bg-white rounded shadow hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                onClick={() => handleOpenChat(u)}
            >
              <p className="font-semibold">
                {u.name || u.email} {onlineUsers.includes(u._id) && <span className='ml-2 text-green-500'>●</span>}
                {u.unread > 0 && <span className="ml-2 text-xs text-red-500">• {u.unread} unread</span>}
              </p>
            </div>
        ))}

        {selectedUser && (
            <ChatBox
                userId={userId}
                partnerId={selectedUser._id}
                partnerName={selectedUser.name || selectedUser.email}
                onClose={() => setSelectedUser(null)}
            />
        )}
      </div>
  );
}