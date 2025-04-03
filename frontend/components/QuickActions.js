import Link from "next/link";
import { FaPlus, FaHandsHelping, FaMapMarkedAlt, FaComments, FaSearch } from "react-icons/fa";

const actions = [
  { icon: <FaPlus />, label: "New Post", href: "/myposts" },
  { icon: <FaHandsHelping />, label: "Help Someone", href: "/volunteering" },
  { icon: <FaSearch />, label: "Find Help", href: "/map" },
  { icon: <FaMapMarkedAlt />, label: "Map", href: "/map" },
  { icon: <FaComments />, label: "Chat", href: "/chat" },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
      {actions.map((action, idx) => (
        <Link key={idx} href={action.href}>
          <div className="flex flex-col items-center bg-blue-100 p-4 rounded hover:bg-blue-200 cursor-pointer transition">
            <div className="text-2xl text-blue-600 mb-1">{action.icon}</div>
            <span className="text-sm font-medium text-center">{action.label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
