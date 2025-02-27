"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { useDepartment } from "@/app/hooks/useDepartment";
import { DepartmentDto } from "@/dtos/DepartmentDTO";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaBuilding, FaEdit, FaSave, FaArrowLeft } from "react-icons/fa";

export default function EditarDepartamentos() {
  const { companyId } = useAuth();
  const { departments, loadDepartments, updateDepartment } = useDepartment();
  const router = useRouter();

  const [filteredDepartments, setFilteredDepartments] = useState<DepartmentDto[]>([]);
  const [editingDepartmentId, setEditingDepartmentId] = useState<string | null>(null);
  const [departmentName, setDepartmentName] = useState<string>("");

  useEffect(() => {
    async function fetchDepartments() {
      await loadDepartments();
    }
    fetchDepartments();
  }, [loadDepartments]);

  useEffect(() => {
    if (companyId) {
      setFilteredDepartments(departments.filter(dept => dept.companyId === companyId));
    }
  }, [departments, companyId]);

  const handleEdit = (department: DepartmentDto) => {
    setEditingDepartmentId(department.id!);
    setDepartmentName(department.name);
  };

  const handleSave = async () => {
    if (!editingDepartmentId || !departmentName.trim()) return;
    
    try {
      await updateDepartment(editingDepartmentId, { name: departmentName });
      setEditingDepartmentId(null);
    } catch (error) {
      console.error("Erro ao atualizar departamento:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 text-white flex flex-col gap-6 h-full max-w-3xl mx-auto">
        
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
            <FaBuilding /> Gerenciar Departamentos
          </h1>
        </div>

        {/* Lista de Departamentos com Scroll Interno */}
        <div className="bg-[#2A2D34] p-6 rounded-lg border border-gray-700 max-h-[500px] overflow-y-auto custom-scrollbar">
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((department) => (
              <div key={department.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-md mb-2">
                {editingDepartmentId === department.id ? (
                  <input
                    type="text"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    className="p-2 bg-gray-700 border border-gray-600 text-white rounded-md outline-none w-full"
                  />
                ) : (
                  <span className="text-gray-300">{department.name}</span>
                )}

                {/* Botões */}
                <div className="flex items-center gap-3">
                  {editingDepartmentId === department.id ? (
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
                    >
                      <FaSave />
                    </motion.button>
                  ) : (
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(department)}
                      className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition"
                    >
                      <FaEdit />
                    </motion.button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">Nenhum departamento encontrado.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
