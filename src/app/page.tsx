"use client";

import React from "react";
import { useRouter } from "next/navigation";
import WelcomeHeader from "@/components/common/WelcomeHeader";
import WelcomeButton from "@/components/common/WelcomeButton";

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center mb-12">
        <WelcomeHeader />
      </div>
      <div className="space-y-4">
        <WelcomeButton
          title="Já é um usuário?"
          backgroundColor="#98ff98"
          textColor="#003366"
          onClick={() => router.push("/login")} // Navegar para a tela de Login
        />
        <WelcomeButton
          title="Quero cadastrar minha empresa"
          backgroundColor="#e0e0e0"
          textColor="#2E3A43"
          onClick={() => router.push("/register")} // Navegar para a tela de Registro
        />
      </div>
    </div>
  );
};

export default WelcomeScreen;
