import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <motion.div
      className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1 }}
    />
  );
}
