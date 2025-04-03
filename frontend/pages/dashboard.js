import { motion } from "framer-motion";
import Link from "next/link";

export default function Dashboard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <motion.div
                className="p-4 bg-white rounded shadow hover:shadow-md transition"
                whileHover={{ scale: 1.02 }}
            >
                <h2 className="text-xl font-semibold mb-2">My Profile</h2>
                <p className="text-gray-600">View and edit your profile information.</p>
                <Link href="/profile" className="text-blue-600 hover:underline block mt-2">
                    Go to Profile
                </Link>
            </motion.div>

            <motion.div
                className="p-4 bg-white rounded shadow hover:shadow-md transition"
                whileHover={{ scale: 1.02 }}
            >
                <h2 className="text-xl font-semibold mb-2">My Posts</h2>
                <p className="text-gray-600">View your published content and interactions.</p>
                <Link href="/myposts" className="text-blue-600 hover:underline block mt-2">
                    Go to Posts
                </Link>
            </motion.div>

            <motion.div
                className="p-4 bg-white rounded shadow hover:shadow-md transition"
                whileHover={{ scale: 1.02 }}
            >
                <h2 className="text-xl font-semibold mb-2">My Good Deeds</h2>
                <p className="text-gray-600">Track your contributions and good actions.</p>
                <Link href="/my-deeds" className="text-blue-600 hover:underline block mt-2">
                    Go to Good Deeds
                </Link>
            </motion.div>

            <motion.div
                className="p-4 bg-white rounded shadow hover:shadow-md transition"
                whileHover={{ scale: 1.02 }}
            >
                <h2 className="text-xl font-semibold mb-2">My Help Hours</h2>
                <p className="text-gray-600">Check how many hours you've volunteered.</p>
                <Link href="/my-hours" className="text-blue-600 hover:underline block mt-2">
                    Go to Help Hours
                </Link>
            </motion.div>

            <motion.div
                className="p-4 bg-white rounded shadow hover:shadow-md transition"
                whileHover={{ scale: 1.02 }}
            >
                <h2 className="text-xl font-semibold mb-2">Wallet</h2>
                <p className="text-gray-600">Manage your balance and donations.</p>
                <Link href="/wallet" className="text-blue-600 hover:underline block mt-2">
                    Open Wallet
                </Link>
            </motion.div>

            <motion.div
                className="p-4 bg-white rounded shadow hover:shadow-md transition"
                whileHover={{ scale: 1.02 }}
            >
                <h2 className="text-xl font-semibold mb-2">Verification</h2>
                <p className="text-gray-600">Check or request verification of your account.</p>
                <Link href="/verification" className="text-blue-600 hover:underline block mt-2">
                    Go to Verification
                </Link>
            </motion.div>
        </div>
    );
}
