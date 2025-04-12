// pages/_app.js
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "@/styles/globals.css";
import Script from "next/script";

// Google Analytics Measurement ID
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// App wrapper with navbar and footer layout
function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Google Analytics integration */}
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

      <div className="flex flex-col bg-gray-950 text-white min-h-screen">
        {/* Navigation bar at the top */}
        <NavBar />

        {/* Main content area */}
        <main className="flex-1 p-4">
          <Component {...pageProps} />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default MyApp;
