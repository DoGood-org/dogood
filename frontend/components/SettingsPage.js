import { useEffect, useState } from "react";
import Toast from "@/components/Toast";

function SettingsPage() {
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("dark");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [publicSlug, setPublicSlug] = useState("");
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [slugMsg, setSlugMsg] = useState("");
  const [isPublicProfile, setIsPublicProfile] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");

  const [activeTab, setActiveTab] = useState("profile");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    useEffect(() => {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, [theme]);


    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/settings", {
      headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then((data) => {
          setName(data.name || "");
          setTheme(data.theme || "dark");
          setIsPublicProfile(data.isPublicProfile || false);
          setPublicSlug(data.publicSlug || "");
          setBio(data.bio || "");
          setAvatar(data.avatar || "");
          setIsEmailVerified(data.isEmailVerified || false);
        });
  }, []);

  useEffect(() => {
    if (!publicSlug || publicSlug.length < 3) {
      setSlugAvailable(null);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`/api/users/check-slug?slug=${publicSlug}`)
          .then((res) => res.json())
          .then((data) => setSlugAvailable(data.available))
          .catch(() => setSlugAvailable(null));
    }, 500);

    return () => clearTimeout(timeout);
  }, [publicSlug]);

  useEffect(() => {
    if (!publicSlug && name) {
      const generated = name
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, "")
          .trim()
          .replace(/\s+/g, "-");
      setPublicSlug(generated);
    }
  }, [name]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, theme, bio, avatar, isPublicProfile, publicSlug }),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      localStorage.setItem("theme", theme);
      setToast({ message: "Settings saved", type: "success" });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassMsg("Please fill out all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMsg("New passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setPassMsg("✅ Password updated.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPassMsg(data.error || "Failed to update password.");
      }
    } catch (err) {
      setPassMsg("Error updating password.");
    }
  };

  const handleResendVerification = async () => {
    try {
      const res = await fetch("/api/settings/email/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        setEmailMsg("Verification email sent.");
      } else {
        const data = await res.json();
        setEmailMsg(data.error || "Failed to send verification email.");
      }
    } catch (err) {
      setEmailMsg("Error sending email.");
    }
  };

  return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="flex gap-4 mb-6">
          {["profile", "security", "notifications"].map((tab) => (
              <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full \${activeTab === tab ? "bg-teal-400 text-black font-bold" : "bg-gray-800 text-gray-300"}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
          ))}
        </div>

        {activeTab === "profile" && (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block mb-1">Bio</label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3 text-black rounded"
                    rows={3}
                />
              </div>

              <div>
                <label className="block mb-1">Avatar</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setAvatar(reader.result.toString());
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="w-full p-2 bg-white text-black rounded"
                />
                {avatar && (
                    <img
                        src={avatar}
                        alt="avatar"
                        className="w-24 h-24 rounded-full mt-2 object-cover border"
                    />
                )}
              </div>

              <div>
                <label className="block mb-1">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 text-black rounded"
                />
              </div>

              <div>
                <label className="block mb-1">Theme</label>
                <select
                    value={theme}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTheme(value);
                      localStorage.setItem("theme", value);
                      if (value === "dark") {
                        document.documentElement.classList.add("dark");
                      } else {
                        document.documentElement.classList.remove("dark");
                      }
                    }}
                    className="w-full p-3 text-black rounded"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Public Profile URL</label>
                <input
                    type="text"
                    value={publicSlug}
                    onChange={(e) => setPublicSlug(e.target.value)}
                    className="w-full p-3 text-black rounded"
                    placeholder="your-name"
                />
                {publicSlug && (
                    <div className="text-sm text-teal-400 mt-1 flex flex-col gap-2">
                      <span>https://dogood.social/u/{publicSlug}</span>
                      <div className="flex gap-4">
                        <button
                            onClick={() => {
                              navigator.clipboard.writeText(`https://dogood.social/u/${publicSlug}`);
                              setSlugMsg("🔗 Link copied");
                            }}
                            className="text-xs underline"
                        >
                          Copy
                        </button>
                        <a
                            href={`https://dogood.social/u/${publicSlug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs underline"
                        >
                          Open Link
                        </a>
                      </div>
                      <img
                          src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=https://dogood.social/u/${publicSlug}`}
                          alt="QR"
                          className="w-32 h-32 bg-white p-1 rounded shadow"
                      />
                    </div>
                )}
                {slugAvailable === false && (
                    <p className="text-red-400 text-xs mt-1">❌ Slug is already taken</p>
                )}
                {slugAvailable === true && (
                    <p className="text-green-400 text-xs mt-1">✅ Slug is available</p>
                )}
                {slugMsg && <p className="text-green-400 text-xs">{slugMsg}</p>}
              </div>

              <button
                  onClick={handleSave}
                  disabled={slugAvailable === false}
                  className="px-6 py-2 bg-teal-400 text-black rounded hover:bg-teal-300"
              >
                Save Settings
              </button>

              <hr className="my-6 border-gray-700" />

              <div className="space-y-2">
                <h2 className="text-xl font-bold">Email Verification</h2>
                <p className={isEmailVerified ? "text-green-400" : "text-red-400"}>
                  {isEmailVerified ? "✅ Your email is verified." : "❗ Your email is not verified."}
                </p>
                {!isEmailVerified && (
                    <button
                        onClick={handleResendVerification}
                        className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300"
                    >
                      Resend Verification Email
                    </button>
                )}
                {emailMsg && <p className="text-sm mt-1 text-yellow-300">{emailMsg}</p>}
              </div>
            </div>
        )}

        {activeTab === "security" && (
            <div className="space-y-2 max-w-xl">
              <h2 className="text-xl font-bold">Change Password</h2>
              <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 text-black rounded"
              />
              <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 text-black rounded"
              />
              <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 text-black rounded"
              />
              <button
                  onClick={handlePasswordChange}
                  className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Change Password
              </button>
              {passMsg && <p className="mt-2 text-sm text-yellow-300">{passMsg}</p>}
            </div>
        )}

        {activeTab === "notifications" && (
            <div className="space-y-4 max-w-xl">
              <h2 className="text-xl font-bold">Notifications</h2>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                Email notifications
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                In-app notifications
              </label>
              <p className="text-sm text-gray-400">Coming soon...</p>
            </div>
        )}

        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
  );
}

export default SettingsPage;