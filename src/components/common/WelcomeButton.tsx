import { motion } from "framer-motion";

interface WelcomeButtonProps {
  title: string;
  backgroundColor?: string;
  textColor?: string;
  glowColor?: string;
  onClick: () => void;
}

const WelcomeButton: React.FC<WelcomeButtonProps> = ({
  title,
  backgroundColor = "bg-blue-600",
  textColor = "text-white",
  glowColor = "shadow-blue-400",
  onClick,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: `0px 0px 10px 3px rgba(255, 255, 255, 0.5)` }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-300 transform hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white ${backgroundColor} ${textColor} ${glowColor} shadow-md`}
      onClick={onClick}
    >
      {title}
    </motion.button>
  );
};

export default WelcomeButton;
