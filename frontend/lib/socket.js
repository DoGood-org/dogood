import { API_URL } from "@/config";
// /frontend/lib/socket.js
import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "API_URL", {
      withCredentials: true,
    });
  }
  return socket;
};
