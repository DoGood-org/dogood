import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="p-8 font-sans">
            <h1 className="text-3xl font-bold mb-6">🤖 GoodBot Assistant</h1>

            <textarea
                rows={4}
                cols={60}
                placeholder="Ask GoodBot anything..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-4 mb-4 text-lg border rounded shadow-sm"
            />

            <button
                onClick={sendMessage}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                {loading ? "Thinking..." : "Send"}
            </button>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-2">💬 Response:</h3>

                <div className="min-h-[100px] bg-gray-100 p-4 rounded shadow-sm">
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
    );
}
