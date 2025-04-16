// CategoryIcon.js
import { motion } from "framer-motion";
import { BookOpen, HeartHandshake, Leaf, Stethoscope, Users, PawPrint, Globe } from "lucide-react";

const icons = {
  volunteer: <Users className="w-6 h-6" />,
  animals: <PawPrint className="w-6 h-6" />,
  nature: <Leaf className="w-6 h-6" />,
  education: <BookOpen className="w-6 h-6" />,
  medical: <Stethoscope className="w-6 h-6" />,
  community: <Globe className="w-6 h-6" />,
};

export default function CategoryIcon({ label, active }) {
  return (
    <motion.div
      className={`flex items-center justify-center w-14 h-14 rounded-full border-2 shadow-md bg-white text-teal-700 ${
        active ? "border-yellow-400 scale-110" : "border-gray-300"
      }`}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      title={label}
    >
      {icons[label.toLowerCase()] || <HeartHandshake className="w-6 h-6" />}
    </motion.div>
  );
}
