"use client";

import { useRouter } from "next/navigation";
import WelcomeHeader from "@/components/common/WelcomeHeader";
import WelcomeButton from "@/components/common/WelcomeButton";

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <WelcomeHeader />
        <div className="space-y-4">
          <WelcomeButton
            title="Já é um usuário?"
            backgroundColor="bg-green-500"
            textColor="text-white"
            onClick={() => router.push("/login")}
          />
          <WelcomeButton
            title="Quero cadastrar minha empresa"
            backgroundColor="bg-gray-300"
            textColor="text-gray-900"
            onClick={() => router.push("/register")}
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
