import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";
import { motion } from "framer-motion";

export default function NavBar() {
    return (
        <motion.nav
            className="bg-white dark:bg-gray-900 shadow-md py-4"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
        >
            <div className="container mx-auto flex justify-between items-center px-6">
                <h1 className="text-xl font-bold text-primary dark:text-white">DoGood</h1>
                <div className="space-x-4">
                    <Link href="/" className="text-secondary hover:text-primary dark:text-white">Главная</Link>
                    <Link href="/wallet" className="text-secondary hover:text-primary dark:text-white">Кошелек</Link>
                    <Link href="/csr" className="text-secondary hover:text-primary dark:text-white">CSR</Link>
                    <Link href="/goodbot" className="text-secondary hover:text-primary dark:text-white">GoodBot</Link>
                    <Link href="/map" className="text-secondary hover:text-primary dark:text-white">Карта</Link>
                    <Link href="/achievements" className="text-secondary hover:text-primary dark:text-white">Достижения</Link>
                    <DarkModeToggle />
                </div>
            </div>
        </motion.nav>
    );
}
