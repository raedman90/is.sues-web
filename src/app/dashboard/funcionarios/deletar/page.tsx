"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { useDepartment } from "@/app/hooks/useDepartment";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaTrash, FaArrowLeft, FaUser, FaBuilding } from "react-icons/fa";

export default function DeleteEmployees() {
  const { companyId, deleteEmployee } = useAuth();
  const { departments, loadDepartments } = useDepartment();
  const router = useRouter();

  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!companyId) return;
      setLoadingEmployees(true);

      try {
        await loadDepartments();

        const companyDepartments = departments.filter(dept => dept.companyId === companyId);

        if (companyDepartments.length === 0) return;

        const employeesList = companyDepartments.flatMap((dept) => 
          dept.users?.map((user) => ({ ...user, departmentName: dept.name, departmentId: dept.id })) || []
        );

        setEmployees(employeesList);
      } catch (error) {
        console.error("Erro ao carregar funcionários:", error);
      } finally {
        setLoadingEmployees(false);
      }
    }

    fetchData();
  }, [companyId]);

  
  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;

    try {
      await deleteEmployee(selectedEmployee.id);

      setEmployees((prev) => prev.filter(emp => emp.id !== selectedEmployee.id));
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error);
      alert("Erro ao deletar funcionário.");
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
            onClick={() => router.push("/dashboard/admin")}
            className="text-gray-400 hover:text-white transition"
          >
            <FaArrowLeft size={20} />
          </motion.button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaBuilding /> Deletar Funcionários
          </h1>
        </div>

        {/* Lista de Funcionários */}
        {loadingEmployees ? (
          <div className="flex justify-center items-center h-40">Carregando funcionários...</div>
        ) : employees.length > 0 ? (
          <div className="bg-[#2A2D34] p-4 rounded-lg border border-gray-700 max-h-[500px] overflow-y-auto custom-scrollbar">
            <ul className="space-y-3">
              {employees.map((employee) => (
                <li
                  key={employee.id}
                  className="flex justify-between items-center p-3 bg-gray-800 rounded-md"
                >
                  <div>
                    <span className="font-semibold">{employee.name}</span> -{" "}
                    <span className="text-gray-400">{employee.departmentName}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setShowConfirmModal(true);
                    }}
                    className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    <FaTrash /> Deletar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-300 text-center">Nenhum funcionário encontrado.</p>
        )}

        {/* Modal de Confirmação */}
        {showConfirmModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#2A2D34] p-6 rounded-lg border border-gray-700 shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaUser /> Confirmar Exclusão
              </h2>
              <p className="text-gray-300">
                Tem certeza que deseja excluir <strong>{selectedEmployee.name}</strong>?
              </p>

              {/* Botões */}
              <div className="flex justify-end mt-4 space-x-4">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  onClick={handleConfirmDelete}
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
