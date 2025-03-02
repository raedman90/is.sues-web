"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import EmailInput from "@/components/input/EmailInput";
import PasswordInput from "@/components/input/PasswordInput";
import ConfirmPasswordInput from "@/components/input/ConfirmPasswordInput";
import NameInput from "@/components/input/NameInput";
import OccupationInput from "@/components/input/OccupationInput";
import { signupSchema } from "@/app/schemas/signupSchema";
import { motion } from "framer-motion";

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    occupation: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setErrors({});
    setLoading(true);

    const validation = signupSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0]] = err.message;
        }
      });
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const user = await signUp(
        formData.name,
        formData.occupation,
        formData.email,
        formData.password,
        formData.isAdmin,
        null
      );

      if (user && user.id) {
        router.push(`/company/create?headid=${user.id}`);
      } else {
        throw new Error("Usuário não retornou um ID.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      setErrors({ form: "Erro ao cadastrar usuário. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#1B1D21] p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-[#24272B] p-6 rounded-lg shadow-lg border border-gray-700"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Crie sua conta</h1>
        <p className="text-sm text-gray-400 mb-4">Preencha os campos abaixo para se cadastrar</p>

        {errors.form && <p className="text-red-400 text-sm mb-4">{errors.form}</p>}

        <div className="space-y-4">
          <NameInput value={formData.name} onChange={(value) => setFormData({ ...formData, name: value })} />
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

          <EmailInput value={formData.email} onChange={(value) => setFormData({ ...formData, email: value })} />
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

          <OccupationInput value={formData.occupation} onChange={(value) => setFormData({ ...formData, occupation: value })} />
          {errors.occupation && <p className="text-red-400 text-sm">{errors.occupation}</p>}

          <PasswordInput value={formData.password} onChange={(value) => setFormData({ ...formData, password: value })} />
          {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}

          <ConfirmPasswordInput value={formData.confirmPassword} onChange={(value) => setFormData({ ...formData, confirmPassword: value })} />
          {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="admin"
              checked={formData.isAdmin}
              onChange={() => setFormData({ ...formData, isAdmin: !formData.isAdmin })}
              className="w-4 h-4 text-[#765AC6] bg-gray-100 border-gray-300 rounded focus:ring-[#765AC6]"
            />
            <label htmlFor="admin" className="text-sm text-gray-400">
              Você é um administrador?
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            disabled={loading}
            className={`w-full py-3 rounded-md font-bold transition transform hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white
              ${loading ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600 shadow-green-400"}
            `}
            onClick={handleSignup}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </motion.button>
        </div>

        <p className="mt-4 text-sm text-gray-400 text-center">
          Já tem uma conta?{" "}
          <span 
            className="text-[#765AC6] cursor-pointer hover:underline transition"
            onClick={() => router.push("/login")}
          >
            Entre aqui
          </span>
        </p>
      </motion.div>
    </div>
  );
}
