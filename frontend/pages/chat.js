// pages/chat.js
import { useState, useRef, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ChatBubble from "@/components/ChatBubble";

const rolePrompts = {
    mentor: "You are a mentor. Respond clearly with examples and advice.",
    motivator: "You are a motivational assistant. Respond in an inspiring and supportive tone.",
    csr: "You are a corporate social responsibility expert. Provide accurate and professional answers.",
    coordinator: "You are a volunteer coordinator. Help organize support with clear steps."
};

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("mentor");
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        const systemPrompt = rolePrompts[role] + "\n\nUser asks: " + input;

        try {
            const res = await fetch("/api/goodbot/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: systemPrompt }),
            });

            const data = await res.json();
            const botMessage = {
                role: "assistant",
                content: data.message || "No response received."
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (err) {
            setMessages((prev) => [...prev, {
                role: "assistant",
                content: "Error: " + err.message
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">💬 Chat with GoodBot</h1>

            <div className="mb-4 max-w-xl mx-auto">
                <label className="font-semibold mr-2">Choose Role:</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="p-2 text-black rounded w-full md:w-auto"
                >
                    <option value="mentor">👨‍🏫 Mentor</option>
                    <option value="motivator">🧘 Motivator</option>
                    <option value="csr">👩‍💼 CSR Expert</option>
                    <option value="coordinator">👷 Volunteer Coordinator</option>
                </select>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 h-[60vh] overflow-y-auto max-w-2xl mx-auto space-y-3">
                {messages.map((msg, index) => (
                    <ChatBubble key={index} message={msg.content} isUser={msg.role === "user"} />
                ))}
                {loading && <LoadingSpinner />}
                <div ref={chatEndRef}></div>
            </div>

            <div className="mt-4 flex flex-col md:flex-row gap-2 max-w-2xl mx-auto">
        <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            rows={2}
            className="flex-1 p-3 text-black rounded resize-none"
        />
                <button
                    onClick={sendMessage}
                    className="w-full md:w-auto px-6 py-2 bg-teal-500 text-black rounded hover:bg-teal-400 transition"
                    disabled={loading}
                >
                    Send
                </button>
            </div>
        </div>
    );
}