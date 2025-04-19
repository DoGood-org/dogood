const isBrowser = typeof window !== "undefined";

export const API_URL = isBrowser && window.location.hostname.includes("localhost")
  ? "http://localhost:5000"
  : "https://dogood.onrender.com";
