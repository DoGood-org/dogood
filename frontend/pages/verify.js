
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function VerifyPage() {
    const router = useRouter();
    const { token, status } = router.query;

    const [message, setMessage] = useState("");
    const [form, setForm] = useState({ name: "", file: null });
    const [submitted, setSubmitted] = useState(false);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        document.title = "Verification";

        if (token) {
            setVerifying(true);
            fetch(`/api/verification/email/confirm?token=${token}`)
                .then((res) => res.text())
                .then((text) => {
                    setMessage(text);
                    setVerifying(false);
                    setTimeout(() => {
                        router.push("/settings");
                    }, 4000);
                })
                .catch(() => {
                    setMessage("❌ Email verification failed.");
                    setVerifying(false);
                });
        } else if (status === "success") {
            setMessage("✅ Your account has been successfully verified. Thank you!");
        } else if (status === "failed") {
            setMessage("❌ Verification failed. Please try again or contact support.");
        }
    }, [token, status, router]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) setForm({ ...form, file: files[0] });
        else setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.file) return;

        const body = new FormData();
        body.append("name", form.name);
        body.append("document", form.file);

        try {
            const res = await fetch("/api/verification/request", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body,
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                setMessage("❌ Failed to submit verification request.");
            }
        } catch (err) {
            setMessage("❌ Submission error.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0e1f1f] to-[#1e3a3a] text-white p-6 flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
            >
                <img src="/goodbot.png" alt="GoodBot" className="w-24 h-24 mx-auto mb-4 rounded-full shadow-lg" />
                <h1 className="text-3xl font-bold mb-4">Verification</h1>
                {verifying && <p className="text-teal-300 mb-4 animate-pulse">Verifying email...</p>}
                {message && !verifying && (
                    <p className="mb-6 text-lg text-teal-400">{message}</p>
                )}
            </motion.div>

            {!token && !status && !submitted && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white text-black p-6 rounded shadow-md max-w-md w-full space-y-4"
                >
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        required
                        onChange={handleChange}
                        className="w-full p-3 rounded border"
                    />
                    <input
                        type="file"
                        accept="image/*,video/*,.pdf"
                        required
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-100 border border-gray-300 rounded"
                    />
                    <button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-500 text-white py-2 rounded"
                    >
                        Submit Verification
                    </button>
                </form>
            )}

            {submitted && (
                <p className="text-green-400 text-lg mt-6">
                    ✅ Verification data submitted. Please wait for confirmation.
                </p>
            )}
        </div>
    );
}

import { motion } from "framer-motion";
