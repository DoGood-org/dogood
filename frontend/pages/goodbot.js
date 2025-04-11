// pages/goodbot.js
import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function GoodBotPage() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setResponse("");

        try {
            const res = await fetch("/api/goodbot/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();
            setResponse(data.message || "No response received.");
        } catch (err) {
            setResponse("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Image src="/goodbot.png" alt="GoodBot" width={64} height={64} className="rounded-full" />
                    <h1 className="text-3xl font-bold">GoodBot Assistant</h1>
                </div>

                {/* User Input */}
                <textarea
                    rows={4}
                    placeholder="Ask GoodBot anything..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-4 mb-4 text-lg text-black rounded"
                />

                <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="px-6 py-2 bg-teal-400 text-black rounded hover:bg-teal-300 transition"
                >
                    {loading ? "Thinking..." : "Send"}
                </button>

                {/* Bot Response */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-2">Response:</h3>

                    <div className="min-h-[100px] bg-gray-800 p-4 rounded-xl shadow-md">
                        {loading && <LoadingSpinner />}

                        <AnimatePresence>
                            {!loading && response && (
                                <motion.div
                                    key="response"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {response}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
