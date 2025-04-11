// pages/verify.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function VerifyPage() {
    const router = useRouter();
    const { status } = router.query;

    const [message, setMessage] = useState("");
    const [form, setForm] = useState({ name: '', file: null });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        document.title = "Verification";
        if (status === "success") {
            setMessage("Your account has been successfully verified. Thank you!");
        } else if (status === "failed") {
            setMessage("Verification failed. Please try again or contact support.");
        }
    }, [status]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) setForm({ ...form, file: files[0] });
        else setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Verification submitted:", form);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <div className="max-w-xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Verification</h1>

                {message && (
                    <p className="mb-6 text-lg text-center text-teal-400">{message}</p>
                )}

                {!status && !submitted && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            required
                            onChange={handleChange}
                            className="w-full p-3 text-black rounded"
                        />
                        <input
                            type="file"
                            accept="image/*,video/*,.pdf"
                            required
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-800 border border-gray-600 rounded"
                        />
                        <button
                            type="submit"
                            className="bg-teal-500 text-black px-6 py-2 rounded hover:bg-teal-400"
                        >
                            Submit Verification
                        </button>
                    </form>
                )}

                {submitted && !status && (
                    <p className="text-lg text-center text-green-400 mt-6">
                        Verification data submitted. Please wait for confirmation.
                    </p>
                )}
            </div>
        </div>
    );
}
