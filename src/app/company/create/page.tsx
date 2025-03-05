"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCompany } from "@/app/hooks/useCompany";
import { companySchema } from "@/app/schemas/registerCompanySchema";
import { z } from "zod";
import { motion } from "framer-motion";
import CompanyMap from "@/components/Map";

export default function CreateCompany() {
  const router = useRouter();
  const { createCompany } = useCompany();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    description: "",
    latitude: null as number | null,
    longitude: null as number | null,
    headid: null as string | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const headid = urlParams.get("headid");
    setFormData((prev) => ({ ...prev, headid }));
  }, []);

  const handleCreateCompany = async () => {
    setErrors({});
    setLoading(true);
  
    const sanitizedFormData = {
      ...formData,
      latitude: formData.latitude ?? undefined,
      longitude: formData.longitude ?? undefined,
    };
  
    const validation = companySchema.safeParse(sanitizedFormData);
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
      await createCompany(sanitizedFormData);
      alert("Empresa criada com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      setErrors({ form: "Erro ao criar empresa. Tente novamente." });
      console.error(error);
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
        <h1 className="text-2xl font-bold text-white mb-2">Criar Empresa</h1>
        <p className="text-sm text-gray-400 mb-4">Preencha os detalhes da empresa</p>

        {errors.form && <p className="text-red-400 text-sm mb-4">{errors.form}</p>}

        <CompanyMap
          onLocationSelect={(lat, lng) => {
            setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
          }}
        />
        {errors.latitude && <p className="text-red-400 text-sm">{errors.latitude}</p>}
        {errors.longitude && <p className="text-red-400 text-sm">{errors.longitude}</p>}

        <div className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="Nome da empresa"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
          />
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

          <input
            type="email"
            placeholder="Email da empresa"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
          />
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

          <input
            type="password"
            placeholder="Senha"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
          />
          {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}

          <input
            type="text"
            placeholder="Descrição da empresa"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            disabled={loading}
            className={`w-full py-3 rounded-md font-bold transition transform hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white
              ${loading ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600 shadow-green-400"}
            `}
            onClick={handleCreateCompany}
          >
            {loading ? "Criando empresa..." : "Criar Empresa"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
