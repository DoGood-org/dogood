import { useState } from "react";
import { useRouter } from "next/router";
import Toast from "../components/Toast";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setToast({ message: "Please fill in all fields", type: "error" });
      return;
    }

    try {
      const response = await axios.post("/api/login", { email, password });
      localStorage.setItem("token", response.data.token);
      setToast({ message: "Login successful!", type: "success" });
      setTimeout(() => {
        router.push("/profile"); // or your dashboard
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.msg || "Login failed";
      setToast({ message: msg, type: "error" });
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <form
            onSubmit={handleLogin}
            className="w-full max-w-sm bg-white p-6 rounded shadow-md"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
          />

          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
          />

          <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>

          {toast.message && (
              <Toast message={toast.message} type={toast.type} />
          )}
        </form>
      </div>
  );
}
