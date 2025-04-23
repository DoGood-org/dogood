import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "volunteer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/auth/register`, form);
      if (res.status === 201) {
        router.push("/login");
      } else {
        setError("Registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
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
    } catch {
      setError("Google OAuth error");
    }
  };

  return (
      <GoogleOAuthProvider clientId="994811339261-9reqbtbcs23vhrafou865tsdsumhbsi2.apps.googleusercontent.com">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <form
              onSubmit={handleSubmit}
              className="w-full max-w-md bg-white p-6 rounded shadow space-y-4"
          >
            <h2 className="text-2xl font-bold text-center">Create an Account</h2>

            {error && (
                <div className="bg-red-100 text-red-800 px-4 py-2 text-sm rounded">{error}</div>
            )}

            <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
            />

            <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            >
              <option value="volunteer">Volunteer</option>
              <option value="donor">Donor</option>
              <option value="ngo">NGO</option>
              <option value="company">Company</option>
            </select>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <div className="mt-4">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google login failed")} />
            </div>
          </form>
        </div>
      </GoogleOAuthProvider>
  );
}
