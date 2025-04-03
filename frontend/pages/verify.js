import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function VerifyPage() {
    const router = useRouter();
    const { status } = router.query;
    const [message, setMessage] = useState("");

    useEffect(() => {
        document.title = "Verification Result";
        if (status === "success") {
            setMessage("Your account has been successfully verified. Thank you!");
        } else if (status === "failed") {
            setMessage("Verification failed. Please try again or contact support.");
        } else {
            setMessage("Awaiting verification status...");
        }
    }, [status]);

    return (
        <div className="p-4 md:p-8 max-w-lg mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Verification</h1>
            <p className="text-gray-700 text-lg">{message}</p>
        </div>
    );
}
