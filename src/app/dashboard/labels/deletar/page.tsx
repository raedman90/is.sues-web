"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { useLabel } from "@/app/hooks/useLabel";
import { useDepartment } from "@/app/hooks/useDepartment";
import { motion } from "framer-motion";
import { FaTrash, FaArrowLeft } from "react-icons/fa";

export default function DeleteLabel() {
  const { companyId } = useAuth();
  const { labels, loadLabels, deleteLabel } = useLabel();
  const { departments, loadDepartments } = useDepartment();
  const [loading, setLoading] = useState(true);
  const [labelToDelete, setLabelToDelete] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await loadDepartments();
      await loadLabels();
      setLoading(false);
    }
    fetchData();
  }, []);

  // Filtrar labels apenas da empresa
  const filteredLabels = labels.filter(label =>
    departments.some(dept => dept.companyId === companyId && dept.id === label.departmentId)
  );

  // Função para deletar label
  const handleConfirmDelete = async () => {
    if (!labelToDelete) return;

    try {
      await deleteLabel(labelToDelete.id);
      setLabelToDelete(null);
      await loadLabels();
    } catch (error) {
      console.error("Erro ao deletar label:", error);
      alert("Erro ao excluir a label.");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 text-white flex flex-col gap-6 h-full">
        
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 border-b border-gray-700 pb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white transition"
          >
            <FaArrowLeft size={20} />
          </motion.button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaTrash /> Deletar Labels
          </h1>
        </div>

        {/* Lista de Labels */}
        {loading ? (
          <div className="flex justify-center items-center h-40">Carregando labels...</div>
        ) : (
          <div className="bg-[#2A2D34] p-4 rounded-lg border border-gray-700 max-h-[500px] overflow-y-auto custom-scrollbar">
            <ul className="space-y-3">
              {filteredLabels.map((label) => (
                <li key={label.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                  <span>{label.name}</span>
                  <button
                    onClick={() => setLabelToDelete({ id: label.id!, name: label.name })}
                    className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    <FaTrash /> Deletar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Modal de Confirmação */}
        {labelToDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-[#2A2D34] p-6 rounded-lg border border-gray-700 max-w-md w-full"
            >
              <h2 className="text-lg font-semibold mb-4">Confirmar Exclusão</h2>
              <p className="text-gray-300 mb-4">
                Tem certeza que deseja excluir a label <span className="text-white font-bold">{labelToDelete.name}</span>? Essa ação não pode ser desfeita.
              </p>
              <div className="flex justify-between">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                  onClick={() => setLabelToDelete(null)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  onClick={handleConfirmDelete}
                >
                  Confirmar Exclusão
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
