import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "donor",
    });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (res.ok && data.token) {
                localStorage.setItem("token", data.token);
                router.push("/dashboard");
            } else {
                setError(data.msg || "Ошибка регистрации");
            }
        } catch (err) {
            setError("Ошибка соединения с сервером");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Регистрация</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                <input name="name" type="text" placeholder="Имя" onChange={handleChange} required className="w-full p-2 border rounded" />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />
                <input name="password" type="password" placeholder="Пароль" onChange={handleChange} required className="w-full p-2 border rounded" />
                <select name="role" onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="donor">Донор</option>
                    <option value="volunteer">Волонтёр</option>
                    <option value="ngo">НКО</option>
                    <option value="company">Компания</option>
                </select>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Зарегистрироваться</button>
            </form>
        </div>
    );
}
