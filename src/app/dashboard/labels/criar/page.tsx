"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useLabel } from "@/app/hooks/useLabel";
import { useDepartment } from "@/app/hooks/useDepartment";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaPlus, FaBuilding, FaCheck } from "react-icons/fa";

export default function CreateLabel() {
  const { createLabel } = useLabel();
  const { departments, loadDepartments } = useDepartment();
  const { companyId } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoadingDepartments(true);
      await loadDepartments();
      setLoadingDepartments(false);
    }
    fetchData();
  }, []);

  const handleCreateLabel = async () => {
    if (!name || !description || !selectedDepartment) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    const labelData = { name, description, departmentId: selectedDepartment };

    try {
      await createLabel(labelData);
      alert("Label criada com sucesso!");
      router.push("/dashboard/admin");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar a label.");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 text-white flex flex-col gap-6 h-full max-w-3xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 border-b border-gray-700 pb-4 w-full">
          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            onClick={() => router.push("/dashboard/admin")}
            className="text-gray-400 hover:text-white transition"
          >
            <FaArrowLeft size={20} />
          </motion.button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaPlus /> Criar Label
          </h1>
        </div>

        {/* Container para seleção de departamentos */}
        <div className="flex flex-col items-center w-full">
        <h2 className="text-lg font-semibold text-gray-300 mb-4 text-center">
            Selecione um Departamento
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
            {departments
            .filter(department => department.companyId === companyId)
            .map((department) => (
                <div 
                key={department.id}
                className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded-lg shadow-md border border-gray-600 hover:bg-gray-700 transition w-full"
                >
                <span className="text-white font-medium">{department.name}</span>
                <button
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    onClick={() => setSelectedDepartment(department.id ?? null)}
                >
                    Selecionar
                </button>
                </div>
            ))}
        </div>
        </div>

        {/* 🔹 Formulário de Criação */}
        {selectedDepartment && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#2A2D34] p-6 rounded-lg border border-gray-700 shadow-md mt-6"
          >
            <h2 className="text-lg font-semibold text-gray-300 mb-4">
              Criar Label para o Departamento
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              
              {/* Nome */}
              <div>
                <label className="block text-gray-300 mb-2">Nome da Label</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
                  placeholder="Digite o nome da label"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-gray-300 mb-2">Descrição da Label</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
                  placeholder="Digite uma descrição"
                />
              </div>
            </div>

            {/* Botão de Criar */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
              onClick={handleCreateLabel}
            >
              <FaPlus /> Criar Label
            </motion.button>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
