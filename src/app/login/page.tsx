"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import EmailInput from "@/components/input/EmailInput";
import PasswordInput from "@/components/input/PasswordInput";
import { signinSchema } from "@/app/schemas/signinSchema";
import { motion } from "framer-motion";

export default function SigninScreen() {
  const router = useRouter();
  const { signIn, signOut } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSignin = async () => {
    setErrors({});
    setLoading(true);

    const validation = signinSchema.safeParse(formData);
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
      const { userData, companyId } = await signIn(formData.email, formData.password);
      const userid = userData.id;

      if (companyId || userData.departmentId) {
        router.push("/dashboard");
      } else {
        console.log("Usuário sem empresa/departamento. Redirecionando para cadastro.");
        signOut();
        router.push(`/company/create?headid=${userid}`);
      }
    } catch (error) {
      setErrors({ form: "Credenciais inválidas. Tente novamente." });
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
        <h1 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</h1>
        <p className="text-sm text-gray-400 mb-4">Preencha os campos para entrar no is.sues</p>

        {errors.form && <p className="text-red-400 text-sm mb-4">{errors.form}</p>}

        <div className="space-y-4">
          <EmailInput value={formData.email} onChange={(value) => setFormData({ ...formData, email: value })} />
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

          <PasswordInput value={formData.password} onChange={(value) => setFormData({ ...formData, password: value })} />
          {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            disabled={loading}
            className={`w-full py-3 rounded-md font-bold transition transform hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white
              ${loading ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600 shadow-green-400"}
            `}
            onClick={handleSignin}
          >
            {loading ? "Entrando..." : "Entrar"}
          </motion.button>
        </div>

        <p className="mt-4 text-sm text-gray-400 text-center">
          Ainda não tem uma conta?{" "}
          <span 
            className="text-[#765AC6] cursor-pointer hover:underline transition"
            onClick={() => router.push("/register")}
          >
            Cadastre-se
          </span>
        </p>
      </motion.div>
    </div>
  );
}
