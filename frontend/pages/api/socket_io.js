// ✅ API: /pages/api/socket_io.js
import { Server } from "socket.io";

let io;
const onlineUsers = new Map();

export default function handler(req, res) {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server, {
      path: "/api/socket_io",
      addTrailingSlash: false,
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("🔌 New socket connected:", socket.id);

      socket.on("join", (room) => {
        socket.join(room);
      });

      socket.on("online", (userId) => {
        onlineUsers.set(userId, socket.id);
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      });

      socket.on("disconnect", () => {
        for (let [key, value] of onlineUsers.entries()) {
          if (value === socket.id) {
            onlineUsers.delete(key);
            break;
          }
        }
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      });

      socket.on("message", (data) => {
        io.to(data.room).emit("message", data);
      });

      socket.on("typing", ({ room, user }) => {
        socket.to(room).emit("typing", { user });
      });
    });

    console.log("✅ Socket.IO server initialized");
  }
  res.end();
}
