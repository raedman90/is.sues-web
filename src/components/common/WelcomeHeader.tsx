import Image from "next/image";
import { motion } from "framer-motion";

const WelcomeHeader: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-4"
    >
      <Image
        src="/images/bg1.png"
        alt="Logo"
        width={250}
        height={250}
        className="rounded-full mx-auto shadow-lg border border-gray-700"
      />
      <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
        Bem-vindo ao <span className="text-[#765AC6]">Is.sues</span>
      </h1>
      <p className="text-lg text-gray-400">Escolha uma opção abaixo para começar</p>
    </motion.div>
  );
};

export default WelcomeHeader;
