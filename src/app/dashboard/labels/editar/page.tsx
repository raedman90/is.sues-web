"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { useLabel } from "@/app/hooks/useLabel";
import { useDepartment } from "@/app/hooks/useDepartment";
import { motion } from "framer-motion";
import { FaEdit, FaArrowLeft } from "react-icons/fa";
import { LabelDto } from "@/dtos/LabelDTO";

export default function EditLabel() {
  const { companyId } = useAuth();
  const { labels, loadLabels, updateLabel } = useLabel();
  const { departments, loadDepartments } = useDepartment();
  const [loading, setLoading] = useState(true);
  const [selectedLabel, setSelectedLabel] = useState<LabelDto | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await loadDepartments();
      await loadLabels();
      setLoading(false);
    }
    fetchData();
  }, []);

  // Filtrar apenas labels pertencentes a departamentos da empresa
  const filteredLabels = labels.filter(label =>
    departments.some(dept => dept.companyId === companyId && dept.id === label.departmentId)
  );

  const handleEditLabel = async () => {
    if (!selectedLabel || !selectedLabel.name || !selectedLabel.description) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    try {
      await updateLabel(selectedLabel.id!, {
        name: selectedLabel.name,
        description: selectedLabel.description,
        departmentId: selectedLabel.departmentId,
      });
      setSelectedLabel(null);
      alert("Label atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar a label.");
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
            <FaEdit /> Editar Labels
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
                    onClick={() => setSelectedLabel(label)}
                    className="flex items-center gap-2 bg-yellow-500 px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                  >
                    <FaEdit /> Editar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Modal de Edição */}
        {selectedLabel && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#2A2D34] p-6 rounded-lg border border-gray-700 max-w-md w-full">
              <h2 className="text-lg font-semibold mb-4">Editar Label</h2>
              <input
                type="text"
                value={selectedLabel.name}
                onChange={(e) => setSelectedLabel({ ...selectedLabel, name: e.target.value })}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 mb-3"
                placeholder="Nome da label"
              />
              <textarea
                value={selectedLabel.description}
                onChange={(e) => setSelectedLabel({ ...selectedLabel, description: e.target.value })}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600"
                placeholder="Descrição"
              ></textarea>
              <div className="flex justify-between mt-4">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                  onClick={() => setSelectedLabel(null)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  onClick={handleEditLabel}
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
