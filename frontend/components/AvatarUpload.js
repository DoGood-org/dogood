import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import Modal from "react-modal";

const API_URL = process.env.NEXT_PUBLIC_API;

export default function AvatarUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then((data) => {
          if (data.avatar) setPreview(data.avatar);
        });
  }, []);

  const handleChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setModalOpen(true);
    }
  };

  const onCropComplete = useCallback((_, cropped) => {
    setCroppedAreaPixels(cropped);
  }, []);

  const handleUpload = async () => {
    if (!file || !croppedAreaPixels) return;

    setLoading(true);

    const croppedBlob = await getCroppedImg(URL.createObjectURL(file), croppedAreaPixels);

    const formData = new FormData();
    formData.append("avatar", croppedBlob, file.name);

    try {
      const res = await axios.post(`${API_URL}/upload/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Avatar updated!");
      if (res.data?.avatar) {
        setPreview(res.data.avatar);
        setModalOpen(false);
        setFile(null);
      }
    } catch {
      toast.error("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(`${API_URL}/upload/avatar`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.data?.success) {
        setPreview(null);
        setFile(null);
        toast.success("Avatar deleted");
      }
    } catch {
      toast.error("Failed to delete avatar");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Profile Picture</h2>

        {preview && (
            <img
                src={preview}
                alt="Avatar preview"
                className="w-32 h-32 rounded-full object-cover border shadow"
            />
        )}

        <input type="file" accept="image/*" onChange={handleChange} />

        {preview && (
            <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Avatar"}
            </button>
        )}

        <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            className="p-4 bg-white rounded shadow max-w-lg mx-auto mt-10"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div className="relative w-full h-64 bg-gray-200">
            <Cropper
                image={file && URL.createObjectURL(file)}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex justify-between items-center mt-4">
            <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
            />
            <button
                onClick={handleUpload}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={loading}
            >
              {loading ? "Uploading..." : "Save Avatar"}
            </button>
          </div>
        </Modal>
      </div>
  );
}
