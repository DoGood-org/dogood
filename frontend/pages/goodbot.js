import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const quickReplies = [
    "How can I help?",
    "Find a volunteer",
    "My statistics",
];

const languages = [
    { code: "en", label: "English" },
    { code: "de", label: "Deutsch" },
    { code: "ua", label: "Українська" },
];

export default function GoodBotPage() {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lang, setLang] = useState("en");

    const sendMessage = async (customPrompt) => {
        const messageToSend = customPrompt || prompt;
        if (!messageToSend.trim()) return;

        setLoading(true);
        setPrompt("");

        setMessages((prev) => [...prev, { sender: "user", text: messageToSend }]);

        try {
            const res = await fetch("/api/goodbot/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: messageToSend, lang, history: messages.map(m => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text })) }),
            });

            const data = await res.json();
            setMessages((prev) => [...prev, { sender: "bot", text: data.message || "No response received." }]);
        } catch (err) {
            setMessages((prev) => [...prev, { sender: "bot", text: "Error: " + err.message }]);
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
                    <select
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                        className="ml-auto bg-white text-black p-1 rounded"
                    >
                        {languages.map((l) => (
                            <option key={l.code} value={l.code}>
                                {l.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2 flex-wrap mb-4">
                    {quickReplies.map((q, i) => (
                        <button
                            key={i}
                            onClick={() => sendMessage(q)}
                            className="bg-teal-700 hover:bg-teal-600 px-4 py-1 rounded text-sm"
                        >
                            {q}
                        </button>
                    ))}
                </div>

                {/* User Input */}
                <textarea
                    rows={3}
                    placeholder="Ask GoodBot anything..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-4 mb-4 text-lg text-black rounded"
                />

                <button
                    onClick={() => sendMessage()}
                    disabled={loading}
                    className="px-6 py-2 bg-teal-400 text-black rounded hover:bg-teal-300 transition"
                >
                    {loading ? "Thinking..." : "Send"}
                </button>

                {/* Bot Chat History */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-2">Chat:</h3>
                    <div className="min-h-[200px] bg-gray-800 p-4 rounded-xl shadow-md space-y-2">
                        {loading && <LoadingSpinner />}
                        <AnimatePresence>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`text-sm px-3 py-2 rounded max-w-[80%] ${
                                        msg.sender === "user"
                                            ? "ml-auto bg-teal-600 text-right"
                                            : "bg-white text-black"
                                    }`}
                                >
                                    {msg.text}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}