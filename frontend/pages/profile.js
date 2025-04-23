import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import MyPosts from "@/components/MyPosts";
import MyGoodDeeds from "@/components/MyGoodDeeds";
import MyHelpHours from "@/components/MyHelpHours";

const tabs = ["Overview", "My Posts", "My Deeds", "My Hours"];

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("Overview");
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.data) {
                    setUser(res.data);
                    setForm({
                        name: res.data.name || "",
                        email: res.data.email || "",
                        role: res.data.role || "volunteer",
                    });
                }
            } catch (err) {
                console.error("Profile fetch failed", err);
                router.push("/login");
            }
        };

        fetchUser();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const res = await axios.put(`${process.env.NEXT_PUBLIC_API}/auth/me`, form, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data) {
                setUser(res.data);
                setEditing(false);
                setError("");
            }
        } catch (err) {
            setError("Update failed");
        }
    };

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/auth/oauth`, {
                provider: "google",
                token: credentialResponse.credential,
            });

            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                router.reload();
            } else {
                setError("Google login failed");
            }
        } catch {
            setError("OAuth error");
        }
    };

    if (!user) return <div className="p-6">Loading profile...</div>;

    return (
        <GoogleOAuthProvider clientId="994811339261-9reqbtbcs23vhrafou865tsdsumhbsi2.apps.googleusercontent.com">
            <div className="min-h-screen p-6 bg-gray-50">
                <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow space-y-6">
                    <h1 className="text-2xl font-bold text-center">My Profile</h1>

                    <div className="flex justify-center gap-2 flex-wrap">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={`px-4 py-1 rounded ${
                                    activeTab === tab
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 hover:bg-gray-300"
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {activeTab === "Overview" && (
                        <div className="mt-4 space-y-3">
                            {error && <div className="text-red-600 text-sm">{error}</div>}
                            {!editing ? (
                                <>
                                    <p><strong>Name:</strong> {user.name}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Role:</strong> {user.role}</p>
                                    <p><strong>Wallet Balance:</strong> ${user.wallet || 0}</p>

                                    <button
                                        onClick={() => setEditing(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                    >
                                        Edit Profile
                                    </button>
                                </>
                            ) : (
                                <form onSubmit={handleUpdate} className="space-y-3">
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    />
                                    <input
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    />
                                    <select
                                        name="role"
                                        value={form.role}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="volunteer">Volunteer</option>
                                        <option value="donor">Donor</option>
                                        <option value="ngo">NGO</option>
                                        <option value="company">Company</option>
                                    </select>

                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditing(false)}
                                            className="bg-gray-300 px-4 py-2 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="mt-4">
                                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google login failed")} />
                            </div>
                        </div>
                    )}

                    {activeTab === "My Posts" && <MyPosts />}
                    {activeTab === "My Deeds" && <MyGoodDeeds />}
                    {activeTab === "My Hours" && <MyHelpHours />}
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}
