import { useState, useEffect, useRef } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const quickReplies = ["How can I help?", "Find a volunteer", "My statistics"];
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
    const scrollRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${process.env.NEXT_PUBLIC_API}/goodbot/history`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                const formatted = data.map((m) => ({
                    sender: m.role === "user" ? "user" : "bot",
                    text: m.content,
                }));
                setMessages(formatted);
            });
    }, []);

    const sendMessage = async (customPrompt) => {
        const messageToSend = customPrompt || prompt;
        if (!messageToSend.trim()) return;

        setLoading(true);
        setPrompt("");

        const newUserMessage = { sender: "user", text: messageToSend };
        setMessages((prev) => [...prev, newUserMessage]);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/goodbot/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    prompt: messageToSend,
                    lang,
                }),
            });

            const data = await res.json();
            const newBotMessage = {
                sender: "bot",
                text: data.message || "No response received.",
            };
            setMessages((prev) => [...prev, newBotMessage]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Error: " + err.message },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        await fetch(`${process.env.NEXT_PUBLIC_API}/goodbot/history`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        setMessages([]);
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Image
                        src="/goodbot.png"
                        alt="GoodBot"
                        width={64}
                        height={64}
                        className="rounded-full"
                    />
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

                <textarea
                    rows={3}
                    placeholder="Ask GoodBot anything..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-4 mb-4 text-lg text-black rounded"
                />

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => sendMessage()}
                        disabled={loading}
                        className="px-6 py-2 bg-teal-400 text-black rounded hover:bg-teal-300 transition"
                    >
                        {loading ? "Thinking..." : "Send"}
                    </button>

                    <button
                        onClick={handleClear}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Clear Chat
                    </button>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-2">Chat:</h3>
                    <div className="min-h-[240px] bg-gray-800 p-4 rounded-xl shadow-md space-y-2">
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
                        <div ref={scrollRef} />
                    </div>
                </div>
            </div>
        </div>
    );
}
