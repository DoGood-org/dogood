import { API_URL } from "@/config";
import { useState } from 'react';
import axios from 'axios';
import Toast from './Toast';

const AvatarUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (!selected || !selected.type.startsWith("image/")) {
      setToast({ message: "Please select a valid image file", type: "error" });
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) {
      setToast({ message: "No file selected", type: "error" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await axios.post(`${API_URL}/api/upload/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 200) {
        setToast({ message: "Avatar uploaded successfully", type: "success" });
        setFile(null);
        setPreview(null);
      }
    } catch (err) {
      setToast({ message: "Upload failed", type: "error" });
    }
  };

  return (
      <div className="space-y-4 bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-semibold">Upload Avatar</h2>

        {preview && (
            <img src={preview} alt="Avatar preview" className="w-24 h-24 rounded-full object-cover" />
        )}

        <input type="file" accept="image/*" onChange={handleChange} className="block" />

        <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Upload
        </button>

        {toast.message && <Toast message={toast.message} type={toast.type} />}
      </div>
  );
};

export default AvatarUpload;
