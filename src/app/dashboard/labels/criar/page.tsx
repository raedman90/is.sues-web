"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useLabel } from "@/app/hooks/useLabel";
import { useDepartment } from "@/app/hooks/useDepartment";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { labelSchema } from "@/app/schemas/labelSchema";
import { z } from "zod";

export default function CreateLabel() {
  const { createLabel } = useLabel();
  const { departments, loadDepartments } = useDepartment();
  const { companyId } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    departmentId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    const validation = labelSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0]] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    try {
      await createLabel(formData);
      setErrors({});
      alert("Label criada com sucesso!");
      router.push("/dashboard/admin");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar a label.");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 text-white flex flex-col gap-6 h-full bg-[#1E1E24] overflow-y-auto">
        
        {/* Cabeçalho */}
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
            <FaPlus /> Criar Label
          </h1>
        </div>

        {/* Seleção de Departamento */}
        <div className="flex flex-col items-center w-full">
          <h2 className="text-lg font-semibold text-gray-300 mb-4 text-center">
            Selecione um Departamento
          </h2>

          {loadingDepartments ? (
            <p className="text-gray-400">Carregando departamentos...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
              {departments
                .filter(department => department.companyId === companyId)
                .map((department) => (
                  <div 
                    key={department.id}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-md border border-gray-600 w-full cursor-pointer
                      ${formData.departmentId === department.id ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"}
                    `}
                    onClick={() => setFormData({ ...formData, departmentId: department.id ?? "" })}
                  >
                    <span className="text-white font-medium">{department.name}</span>
                  </div>
                ))}
            </div>
          )}
          {errors.departmentId && <p className="text-red-400 text-sm mt-2">{errors.departmentId}</p>}
        </div>

        {/* Formulário de Criação */}
        {formData.departmentId && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#2A2D34] p-6 rounded-lg border border-gray-700 shadow-md mt-6 w-full max-w-3xl"
          >
            <h2 className="text-lg font-semibold text-gray-300 mb-4">
              Criar Label para o Departamento
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nome */}
              <div>
                <label className="block text-gray-300 mb-2">Nome da Label</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
                  placeholder="Digite o nome da label"
                />
                {errors.name && <p className="text-red-400 text-sm mt-2">{errors.name}</p>}
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-gray-300 mb-2">Descrição da Label</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
                  placeholder="Digite uma descrição"
                />
                {errors.description && <p className="text-red-400 text-sm mt-2">{errors.description}</p>}
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
