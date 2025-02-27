"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { useDepartment } from "@/app/hooks/useDepartment";
import { useLabel } from "@/app/hooks/useLabel"; // Hook para labels
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaUser, FaTag, FaBuilding } from "react-icons/fa";
import { motion } from "framer-motion";
import { LabelDto } from "@/dtos/LabelDTO";

export default function DepartmentInfo() {
  const { user, companyId } = useAuth();
  const { departments, loadDepartments } = useDepartment();
  const { labels, loadLabels } = useLabel();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await Promise.all([loadDepartments(), loadLabels()]);
      setLoading(false);
    }
    fetchData();
  }, []);

  const department = departments.find(dept => dept.id === selectedDepartment && dept.companyId === companyId);
  const departmentLabels: LabelDto[] = labels.filter(label => label.departmentId === selectedDepartment);

  return (
    <DashboardLayout>
      <div className="p-6 text-white flex flex-col gap-6 h-full">
        
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
            <FaBuilding /> Informações do Departamento
          </h1>
        </div>

        {/* Selecionar Departamento */}
        <div className="bg-[#2A2D34] p-4 rounded-lg border border-gray-700">
          <label className="block text-gray-300 mb-2">Selecione um departamento:</label>
          <select
            value={selectedDepartment || ""}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-600"
          >
            <option value="" disabled>Escolha um departamento</option>
            {departments
              .filter(dept => dept.companyId === companyId)
              .map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
          </select>
        </div>

        {/* Informações do Departamento */}
        {selectedDepartment && department ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lista de Funcionários */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-[#2A2D34] p-4 rounded-lg border border-gray-700"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-300 mb-4">
                <FaUser /> Funcionários do Departamento
              </h2>
              {department.users && department.users.length > 0 ? (
                <ul className="space-y-2">
                  {department.users.map(user => (
                    <li key={user.id} className="bg-gray-800 p-2 rounded-md text-gray-300">
                      {user.name} ({user.occupation})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">Nenhum funcionário encontrado.</p>
              )}
            </motion.div>

            {/* Lista de Labels */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-[#2A2D34] p-4 rounded-lg border border-gray-700"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-300 mb-4">
                <FaTag /> Labels do Departamento
              </h2>
              {departmentLabels.length > 0 ? (
                <ul className="space-y-2">
                  {departmentLabels.map(label => (
                    <li key={label.id} className="bg-gray-800 p-2 rounded-md text-gray-300">
                      {label.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">Nenhuma label encontrada.</p>
              )}
            </motion.div>
          </div>
        ) : (
          <p className="text-gray-300">Selecione um departamento para visualizar as informações.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
