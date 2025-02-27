import { motion } from "framer-motion";

interface PopupProps {
  message: string;
  onClose: () => void;
}

export default function Popup({ message, onClose }: PopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-md shadow-lg border border-gray-600"
    >
      <p>{message}</p>
      <button className="mt-2 text-blue-400 hover:underline" onClick={onClose}>
        Fechar
      </button>
    </motion.div>
  );
}
