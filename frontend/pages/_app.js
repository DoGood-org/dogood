import "@/styles/globals.css";
import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { ThemeProvider } from "next-themes";
import Layout from "@/components/Layout";
import Script from "next/script";

export default function App({ Component, pageProps }) {
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${process.env.NEXT_PUBLIC_API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load user");
                return res.json();
            })
            .then((user) => {
                if (user && user._id) {
                    const socket = getSocket();
                    socket.emit("online", user._id);
                }
            })
            .catch((err) => {
                console.warn("Socket init failed:", err.message);
            });
    }, []);

    return (
        <ThemeProvider attribute="class">
            <Layout>
                <Component {...pageProps} />
                {process.env.NEXT_PUBLIC_GA_ID && (
                    <>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                            strategy="afterInteractive"
                        />
                        <Script id="google-analytics" strategy="afterInteractive">
                            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
                        </Script>
                    </>
                )}
            </Layout>
        </ThemeProvider>
    );
}
