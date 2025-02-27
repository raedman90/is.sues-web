"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { getCompany } from "@/api/apiCompany";
import { CompanyDto } from "@/dtos/CompanyDTO";
import { useRouter } from "next/navigation";
import { FaBuilding, FaUserCog, FaUsers, FaTag, FaPlus, FaEdit, FaTrash, FaList } from "react-icons/fa";
import { motion } from "framer-motion";

export default function CompanyAdmin() {
  const { user, companyId } = useAuth();
  const router = useRouter();
  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanyData() {
      if (!companyId) {
        console.error("Nenhuma empresa vinculada ao usuário.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const companyData = await getCompany(companyId);
        setCompany(companyData);
      } catch (error) {
        console.error("Erro ao carregar empresa:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyData();
  }, [companyId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen text-white">
          Carregando informações...
        </div>
      </DashboardLayout>
    );
  }

  if (!company || user?.id !== company.headid) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen text-red-400 font-bold">
          ❌ Acesso negado. Apenas o dono da empresa pode acessar este painel.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 text-white flex flex-col gap-6 h-full">
        {/* Título */}
        <h1 className="text-2xl font-bold flex items-center gap-2 border-b border-gray-700 p-6">
          <FaBuilding /> Painel Administrativo - {company.name}
        </h1>

        {/* Container com Scroll se necessário */}
        <div className="flex-grow overflow-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Empresa */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="bg-[#2A2D34] p-4 rounded-lg border border-gray-700 shadow-lg"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-300 mb-4">
                <FaUserCog /> Empresa
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="w-full flex items-center gap-3 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
                onClick={() => router.push("/dashboard/empresa/editar")}
              >
                <FaEdit /> Editar Empresa
              </motion.button>
            </motion.div>

            {/* Departamentos */}
            <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="bg-[#2A2D34] p-4 rounded-lg border border-gray-700 shadow-lg"
            >
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-300 mb-4">
                <FaBuilding /> Departamentos
            </h2>
            <div className="space-y-3">
                <motion.button
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="w-full flex items-center gap-3 bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
                onClick={() => router.push("/dashboard/departamentos/criar")}
                >
                <FaPlus /> Criar Departamento
                </motion.button>
                <motion.button
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="w-full flex items-center gap-3 bg-yellow-500 text-white p-3 rounded-md hover:bg-yellow-600 transition"
                onClick={() => router.push("/dashboard/departamentos/editar")}
                >
                <FaEdit /> Editar Departamento
                </motion.button>
                <motion.button
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="w-full flex items-center gap-3 bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition"
                onClick={() => router.push("/dashboard/departamentos/deletar")}
                >
                <FaTrash /> Apagar Departamento
                </motion.button>
                <motion.button
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="w-full flex items-center gap-3 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
                onClick={() => router.push("/dashboard/departamentos/info")}
                >
                <FaList /> Informações do Departamento
                </motion.button>
            </div>
            </motion.div>

            {/* Funcionários */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="bg-[#2A2D34] p-4 rounded-lg border border-gray-700 shadow-lg"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-300 mb-4">
                <FaUsers /> Funcionários
              </h2>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex items-center gap-3 bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
                  onClick={() => router.push("/dashboard/funcionarios/criar")}
                >
                  <FaPlus /> Criar Funcionário
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex items-center gap-3 bg-yellow-500 text-white p-3 rounded-md hover:bg-yellow-600 transition"
                  onClick={() => router.push("/dashboard/funcionarios/editar")}
                >
                  <FaEdit /> Editar Funcionário
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex items-center gap-3 bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition"
                  onClick={() => router.push("/dashboard/funcionarios/deletar")}
                >
                  <FaTrash /> Apagar Funcionário
                </motion.button>
              </div>
            </motion.div>

            {/* Labels */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="bg-[#2A2D34] p-4 rounded-lg border border-gray-700 shadow-lg"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-300 mb-4">
                <FaTag /> Labels
              </h2>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex items-center gap-3 bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
                  onClick={() => router.push("/dashboard/labels/criar")}
                >
                  <FaPlus /> Criar Label
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex items-center gap-3 bg-yellow-500 text-white p-3 rounded-md hover:bg-yellow-600 transition"
                  onClick={() => router.push("/dashboard/labels/editar")}
                >
                  <FaEdit /> Editar Label
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex items-center gap-3 bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition"
                  onClick={() => router.push("/dashboard/labels/deletar")}
                >
                  <FaTrash /> Apagar Label
                </motion.button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
