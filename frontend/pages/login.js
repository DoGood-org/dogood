import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/auth/login`, {
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        router.push("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/auth/oauth`, {
        provider: "google",
        token: credentialResponse.credential,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        router.push("/dashboard");
      } else {
        setError("Google login failed");
      }
    } catch (err) {
      setError("OAuth error");
    }
  };

  return (
      <GoogleOAuthProvider clientId="994811339261-9reqbtbcs23vhrafou865tsdsumhbsi2.apps.googleusercontent.com">
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

            {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-3 border rounded"
                required
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
                required
            />

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>

            <div className="mt-4">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google login failed")} />
            </div>
          </form>
        </div>
      </GoogleOAuthProvider>
  );
}
