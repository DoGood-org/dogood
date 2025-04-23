import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const isBrowser = typeof window !== "undefined";
    const isLocalhost = isBrowser && window.location.hostname === "localhost";

    const baseURL = isLocalhost
        ? "http://localhost:5000"
        : "https://dogood-backend.onrender.com";

    socket = io(baseURL, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
    });
  }

  return socket;
};
