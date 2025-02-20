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
  const { signIn, signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignin = async () => {
    setError(null);
    setLoading(true);
    try {
      const { userData, companyId } = await signIn(email, password);
      const userid = userData.id;

      if (companyId || userData.departmentId) {
        router.push("/dashboard");
      } else {
        console.log("Usuário não tem empresa nem departamento. Redirecionando para Criar Empresa.");
        signOut();
        router.push(`/register?headid=${userid}`);
      }
    } catch (error) {
      setError("Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo de volta</h1>
        <p className="text-sm text-gray-600 mb-4">Preencha os campos para entrar no is.sues</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          <EmailInput value={email} onChange={setEmail} />
          <PasswordInput value={password} onChange={setPassword} />
          <button
            onClick={handleSignin}
            disabled={loading}
            className={`w-full py-3 rounded-md font-bold transition duration-300 transform hover:scale-105 hover:shadow-lg ${
              loading ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Ainda não tem uma conta?{" "}
          <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => router.push("/register")}>
            Cadastre-se
          </span>
        </p>
      </div>
    </div>
  );
}
