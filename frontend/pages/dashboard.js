import { motion } from "framer-motion";
import Link from "next/link";
import { FaUser, FaEdit, FaHandsHelping, FaClock, FaWallet, FaCheckCircle } from "react-icons/fa";

export default function Dashboard() {
  const cards = [
    {
      href: "/profile",
      title: "My Profile",
      description: "View and edit your profile information.",
      icon: <FaUser size={28} className="text-indigo-600" />,
    },
    {
      href: "/myposts",
      title: "My Posts",
      description: "View your published content and interactions.",
      icon: <FaEdit size={28} className="text-indigo-600" />,
    },
    {
      href: "/my-deeds",
      title: "My Good Deeds",
      description: "Track your contributions and good actions.",
      icon: <FaHandsHelping size={28} className="text-indigo-600" />,
    },
    {
      href: "/my-hours",
      title: "My Help Hours",
      description: "Check how many hours you've volunteered.",
      icon: <FaClock size={28} className="text-indigo-600" />,
    },
    {
      href: "/wallet",
      title: "Wallet",
      description: "Manage your balance and donations.",
      icon: <FaWallet size={28} className="text-indigo-600" />,
    },
    {
      href: "/verification",
      title: "Verification",
      description: "Check or request verification of your account.",
      icon: <FaCheckCircle size={28} className="text-indigo-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {cards.map(({ href, title, description, icon }) => (
        <motion.div
          key={href}
          className="p-4 bg-white rounded shadow hover:shadow-lg transition cursor-pointer flex items-start gap-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="mt-1">{icon}</div>
          <div>
            <h2 className="text-xl font-semibold mb-1">{title}</h2>
            <p className="text-gray-600 text-sm">{description}</p>
            <Link href={href} className="text-blue-600 hover:underline text-sm inline-block mt-2">
              Open
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
