"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import EmailInput from "@/components/input/EmailInput";
import PasswordInput from "@/components/input/PasswordInput";
import ConfirmPasswordInput from "@/components/input/ConfirmPasswordInput";
import NameInput from "@/components/input/NameInput";
import OccupationInput from "@/components/input/OccupationInput";
import { UsersDto } from "@/dtos/UserDTO";

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError(null);
  
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
  
    setLoading(true);
    try {
      const user: UsersDto = await signUp(name, occupation, email, password, isAdmin, null); // ✅
  
      if (user && user.id) { 
        router.push(`/company/create?headid=${user.id}`);
      } else {
        throw new Error("Usuário não retornou um ID.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error); // ✅ Verificando erro detalhado
      setError(`Erro ao cadastrar usuário: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Crie sua conta</h1>
        <p className="text-sm text-gray-600 mb-4">Preencha os campos abaixo para se cadastrar</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          <NameInput value={name} onChange={setName} />
          <EmailInput value={email} onChange={setEmail} />
          <OccupationInput value={occupation} onChange={setOccupation} />
          <PasswordInput value={password} onChange={setPassword} />
          <ConfirmPasswordInput value={confirmPassword} onChange={setConfirmPassword} />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="admin"
              checked={isAdmin}
              onChange={() => setIsAdmin(!isAdmin)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="admin" className="text-sm text-gray-700">
              Você é um administrador?
            </label>
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className={`w-full py-3 rounded-md font-bold transition duration-300 transform hover:scale-105 hover:shadow-lg ${
              loading ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Já tem uma conta?{" "}
          <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => router.push("/login")}>
            Entre aqui
          </span>
        </p>
      </div>
    </div>
  );
}
