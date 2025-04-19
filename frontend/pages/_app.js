import { useEffect } from "react";
import Layout from "@/components/Layout";
import "@/styles/globals.css";
import ThemeManager from "@/components/ThemeManager";
import { getSocket } from "@/lib/socket";
import Script from "next/script";
import { useRouter } from 'next/router';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        const socket = getSocket();

        socket.on("connect", () => {
            console.log("🟢 Socket connected:", socket.id);
            const userId = localStorage.getItem("userId") || "123";
            socket.emit("online", userId);
        });

        socket.on("disconnect", () => {
            console.log("🔴 Socket disconnected");
        });
    }, []);

    return (
        <>
            {GA_ID && (
                <>
                    <Script
                        strategy="afterInteractive"
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                    />
                    <Script
                        id="google-analytics"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `,
                        }}
                    />
                </>
            )}

            <ThemeManager />
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    );
}

export default MyApp;