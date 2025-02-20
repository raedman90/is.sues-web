"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import EmailInput from "@/components/input/EmailInput";
import PasswordInput from "@/components/input/PasswordInput";

export default function SigninScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signOut } = useAuth(); // Hook de autenticação

  const handleSignin = async () => {
    try {
      const { userData, companyId } = await signIn(email, password); // Executa o login e aguarda o retorno
      const userid = userData.id;

      // Verifica se o usuário está associado a uma empresa ou departamento
      if (companyId) {
        router.push("/dashboard"); // Redireciona para o Dashboard
      } else if (userData.departmentId) {
        router.push("/dashboard");
      } else {
        console.log("Usuário não tem empresa nem departamento. Redirecionando para Criar Empresa.");
        signOut();
        router.push(`/register?headid=${userid}`); // Passa o `headid` como parâmetro
      }
    } catch (error) {
      alert("Erro: Credenciais inválidas");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="w-4/5 max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Que bom tê-lo de volta</h1>
        <p className="text-sm text-gray-600 mb-4">Preencha os campos para entrar no is.sues</p>
        <div className="space-y-4">
          <EmailInput value={email} onChange={setEmail} />
          <PasswordInput value={password} onChange={setPassword} />
          <button
            onClick={handleSignin}
            className="w-full bg-green-400 text-blue-900 py-3 rounded-md font-bold hover:bg-green-500 transition"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
