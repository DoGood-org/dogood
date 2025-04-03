import { useEffect } from "react";

export default function Page() {
    useEffect(() => {
        document.title = "Welcome to DoGood!";
    }, []);

    return (
        <div className="p-6 md:p-12 max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome to DoGood!</h1>
            <p className="text-lg md:text-xl text-gray-700">
                This is the welcome page of DoGood — a platform for real change.
            </p>
        </div>
    );
}
