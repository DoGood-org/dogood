import { useState } from "react";

export default function GoodBot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        try {
            const res = await fetch("http://localhost:5000/api/goodbot/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ prompt: input }),
            });

            const data = await res.json();

            const botMessage = {
                role: "assistant",
                content: data.message || "⚠ Ошибка ответа",
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Ошибка при запросе:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "⚠ Сервер недоступен" },
            ]);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">🤖 GoodBot — ваш AI-помощник</h1>
            <div className="h-96 overflow-y-auto border p-3 mb-4 rounded bg-gray-50">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
                    >
            <span
                className={
                    msg.role === "user" ? "bg-blue-100" : "bg-green-100"
                }
                style={{ padding: 6, borderRadius: 6, display: "inline-block" }}
            >
              <strong>{msg.role === "user" ? "Вы" : "GoodBot"}:</strong> {msg.content}
            </span>
                    </div>
                ))}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2">
                <input
                    type="text"
                    placeholder="Задай вопрос..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow p-2 border rounded"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Отправить
                </button>
            </form>
        </div>
    );
}