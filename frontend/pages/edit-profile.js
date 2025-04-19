"use client"
import { useEffect, useState } from "react";
import Toast from "../components/Toast";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  useEffect(() => {
    document.title = "Edit Profile";
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setBio(data.bio || "");
        setInterests(data.interests ? data.interests.join(", ") : "");
        setAvatarUrl(data.avatar || "");
      } catch {
        setToast({ message: "Failed to load profile", type: "error" });
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    try {
      const res1 = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const res2 = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio, interests }),
      });

      const ok = res1.ok && res2.ok;
      setToast({ message: ok ? "Profile updated" : "Update failed", type: ok ? "success" : "error" });
    } catch {
      setToast({ message: "Server error", type: "error" });
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setAvatarUrl(data.avatar);
        setToast({ message: "Avatar updated", type: "success" });
      } else {
        setToast({ message: data.msg || "Avatar upload failed", type: "error" });
      }
    } catch {
      setToast({ message: "Upload error", type: "error" });
    }
  };

  return (
      <div className="p-4 md:p-8 max-w-xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Edit Profile</h1>

        <div className="bg-white rounded shadow-md p-6 space-y-4">
          <div className="text-center">
            {avatarUrl && <img src={avatarUrl} alt="avatar" className="w-24 h-24 rounded-full mx-auto mb-2" />}
            <input type="file" onChange={(e) => setAvatarFile(e.target.files[0])} />
            <button
                onClick={handleAvatarUpload}
                className="mt-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
            >
              Upload Avatar
            </button>
          </div>

          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Bio</label>
            <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Interests (comma separated)</label>
            <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full p-2 border rounded"
            />
          </div>

          <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>

          {toast.message && <Toast message={toast.message} type={toast.type} />}
        </div>
      </div>
  );
}
