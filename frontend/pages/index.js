import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-200 to-green-200">
            <h1 className="text-5xl font-bold text-gray-900">Добро пожаловать в DoGood!</h1>
            <p className="mt-4 text-xl text-gray-700">Помогайте людям, станьте волонтёром или делайте пожертвования.</p>
            <div className="mt-6 space-x-4">
                <Link href="/register">
                    <button className="bg-accent text-white px-6 py-3 rounded-md text-lg shadow-md hover:bg-green-600 transition">
                        Регистрация
                    </button>
                </Link>
                <Link href="/login">
                    <button className="bg-primary text-white px-6 py-3 rounded-md text-lg shadow-md hover:bg-blue-600 transition">
                        Вход
                    </button>
                </Link>
            </div>
        </div>
    );
}
