import { useState } from "react";
import { useRouter } from "next/router";
import Toast from "../components/Toast";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password || !name) {
      setToast({ message: "Please fill in all fields", type: "error" });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/login");
      } else {
        setToast({ message: data.error || "Registration failed", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Something went wrong", type: "error" });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/oauth", {
        provider: "google",
        token: credentialResponse.credential,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        router.push("/dashboard");
      } else {
        setToast({ message: "OAuth failed", type: "error" });
      }
    } catch (err) {
      setToast({ message: "OAuth error", type: "error" });
    }
  };

  return (
      <GoogleOAuthProvider clientId="994811339261-7getpt22o5g4t74v1kmm0k9ltqu1i12b.apps.googleusercontent.com">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <form
              onSubmit={handleRegister}
              className="w-full max-w-sm bg-white p-6 rounded shadow-md"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

            <label className="block mb-2 text-sm font-medium">Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
            />

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
              Sign Up
            </button>

            <div className="mt-4">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setToast({ message: "Google Login failed", type: "error" })} />
            </div>

            {toast.message && (
                <Toast message={toast.message} type={toast.type} />
            )}
          </form>
        </div>
      </GoogleOAuthProvider>
  );
}
