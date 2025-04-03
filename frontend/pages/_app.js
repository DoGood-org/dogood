import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import "../styles/globals.css"; 

function MyApp({ Component, pageProps }) {
    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-60 w-full">
                <NavBar />
                <main className="p-4">
                    <Component {...pageProps} />
                </main>
            </div>
        </div>
    );
}

export default MyApp;
