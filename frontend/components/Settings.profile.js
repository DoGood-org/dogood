
import { useState } from "react";

export default function Settings() {
  const [name, setName] = useState("Alexander");
  const [bio, setBio] = useState("Enthusiast, volunteer and founder of DoGood.");
  const [avatar, setAvatar] = useState("");
  const [message, setMessage] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result.toString());
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, bio, avatar }),
      });
      const data = await res.json();
      if (res.ok) setMessage("✅ Profile updated successfully.");
      else setMessage(data.error || "Failed to update profile.");
    } catch (err) {
      setMessage("Error while updating profile.");
    }
  };

  return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10 space-y-6">
        <h1 className="text-2xl font-bold">Profile Settings</h1>

        <div className="space-y-2">
          <label className="block font-medium">Full Name</label>
          <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">About Me</label>
          <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Avatar</label>
          <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full p-2 border rounded"
          />
          {avatar && (
              <img src={avatar} alt="Avatar Preview" className="w-32 h-32 object-cover rounded-full shadow" />
          )}
        </div>

        <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>

        {message && <p className="text-green-600 font-medium mt-2">{message}</p>}
      </div>
  );
}
