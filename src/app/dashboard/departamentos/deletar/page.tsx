"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { useDepartment } from "@/app/hooks/useDepartment";
import { useRouter } from "next/navigation";
import { FaTrash, FaBuilding, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function DeleteDepartments() {
  const { companyId } = useAuth();
  const { departments, loadDepartments, deleteDepartment } = useDepartment();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchDepartments() {
      setLoading(true);
      await loadDepartments();
      setLoading(false);
    }
    fetchDepartments();
  }, []);

  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return;

    try {
      await deleteDepartment(selectedDepartment);
      setShowModal(false);
      setSelectedDepartment(null);
      alert("Departamento deletado com sucesso!");
      await loadDepartments();
    } catch (error) {
      alert("Erro ao deletar departamento.");
      console.error("Erro ao deletar:", error);
    }
  };

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
            <FaBuilding /> Apagar Departamentos
          </h1>
        </div>

        {/* Verificação de Carregamento */}
        {loading ? (
          <div className="flex justify-center items-center h-40">Carregando departamentos...</div>
        ) : (
          <div className="bg-[#2A2D34] p-4 rounded-lg border border-gray-700 max-h-[500px] overflow-y-auto custom-scrollbar">
            {departments.filter(dept => dept.companyId === companyId).length > 0 ? (
              <ul className="space-y-3">
                {departments
                  .filter(dept => dept.companyId === companyId)
                  .map((dept) => (
                    <li
                      key={dept.id}
                      className="flex justify-between items-center p-3 bg-gray-800 rounded-md"
                    >
                      <span>{dept.name}</span>
                      <button
                        onClick={() => {
                          setSelectedDepartment(dept.id!);
                          setShowModal(true);
                        }}
                        className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
                      >
                        <FaTrash /> Deletar
                      </button>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-300 text-center">Nenhum departamento encontrado.</p>
            )}
          </div>
        )}

        {/* MODAL DE CONFIRMAÇÃO */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-[#2A2D34] p-6 rounded-lg border border-gray-700 w-[400px] text-center"
            >
              <FaExclamationTriangle className="text-yellow-400 text-4xl mx-auto mb-3" />
              <h2 className="text-xl font-semibold">Confirmar Exclusão</h2>
              <p className="text-gray-300 mt-2">
                Tem certeza que deseja deletar este departamento? Esta ação não pode ser desfeita.
              </p>

              <div className="flex justify-center gap-4 mt-6">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleDeleteDepartment}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Deletar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
