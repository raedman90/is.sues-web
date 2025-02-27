"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { useDepartment } from "@/app/hooks/useDepartment";
import { useRouter } from "next/navigation";
import { DepartmentDto } from "@/dtos/DepartmentDTO";
import { motion } from "framer-motion";
import { FaBuilding, FaArrowLeft } from "react-icons/fa";

export default function CriarDepartamento() {
  const { companyId } = useAuth();
  const { createDepartment } = useDepartment();
  const router = useRouter();

  const [name, setName] = useState("");
  const [companyIdState, setCompanyIdState] = useState<string>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (companyId) {
      setCompanyIdState(companyId);
    } else {
      setError("ID da empresa não encontrado.");
    }
  }, [companyId]);

  const handleCreateDepartment = async () => {
    if (!name.trim()) {
      setError("O nome do departamento é obrigatório.");
      return;
    }

    if (!companyIdState) {
      setError("Erro ao carregar o ID da empresa.");
      return;
    }

    setError("");
    setSuccess("");

    const departmentData: DepartmentDto = {
      name,
      companyId: companyIdState,
      users: [],
    };

    try {
      await createDepartment(departmentData);
      setSuccess("Departamento criado com sucesso!");
      setTimeout(() => router.push("/dashboard/admin"), 1500);
    } catch (error) {
      console.error("Erro ao criar departamento:", error);
      setError("Ocorreu um erro ao criar o departamento. Tente novamente.");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 text-white flex flex-col gap-6 h-full max-w-2xl mx-auto">
        
        {/* Título */}
        <div className="flex items-center gap-3 border-b border-gray-700 pb-4">
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            transition={{ duration: 0.2 }} 
            onClick={() => router.push("/dashboard/admin")}
            className="text-gray-400 hover:text-white transition"
          >
            <FaArrowLeft size={20} />
          </motion.button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaBuilding /> Criar Departamento
          </h1>
        </div>

        {/* Formulário */}
        <div className="bg-[#2A2D34] p-6 rounded-lg border border-gray-700">
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            Nome do Departamento:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-600 text-white outline-none focus:border-[#7864F4]"
            placeholder="Digite o nome do departamento"
          />

          {/* Exibir mensagens de erro ou sucesso */}
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}

          {/* Botão de Criar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateDepartment}
            className="w-full bg-[#7864F4] text-white py-3 mt-4 rounded-md font-semibold hover:bg-[#6b55e1] transition"
          >
            Criar Departamento
          </motion.button>
        </div>
      </div>
    </DashboardLayout>
  );
}
