"use client";

import { useRouter } from "next/navigation";
import WelcomeHeader from "@/components/common/WelcomeHeader";
import WelcomeButton from "@/components/common/WelcomeButton";
import { motion } from "framer-motion";

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#1B1D21] p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full text-center space-y-8 bg-[#24272B] shadow-lg rounded-xl p-8 border border-gray-700"
      >
        <WelcomeHeader />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-4"
        >
          <WelcomeButton
            title="Já é um usuário?"
            backgroundColor="bg-green-500"
            textColor="text-white"
            glowColor="shadow-green-400"
            onClick={() => router.push("/login")}
          />
          <WelcomeButton
            title="Quero cadastrar minha empresa"
            backgroundColor="bg-[#765AC6]"
            textColor="text-white"
            glowColor="shadow-[#A58FE7]"
            onClick={() => router.push("/register")}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
