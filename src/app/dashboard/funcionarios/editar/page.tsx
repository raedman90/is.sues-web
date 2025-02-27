"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { useDepartment } from "@/app/hooks/useDepartment";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaEdit, FaArrowLeft, FaUser, FaBuilding, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function EditEmployees() {
  const { companyId, updateUser } = useAuth();
  const { departments, loadDepartments } = useDepartment();
  const router = useRouter();

  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDepartments, setShowDepartments] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!companyId) return;
      setLoadingEmployees(true);

      try {
        await loadDepartments();

        const companyDepartments = departments.filter(dept => dept.companyId === companyId);
        setFilteredDepartments(companyDepartments);

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

  
  const handleSaveEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      await updateUser(
        selectedEmployee.id,
        selectedEmployee.name,
        selectedEmployee.occupation,
        selectedEmployee.email,
        selectedEmployee.departmentId
      );

      setEmployees((prev) =>
        prev.map(emp => (emp.id === selectedEmployee.id ? { ...selectedEmployee } : emp))
      );

      setShowModal(false);
      alert("Funcionário atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error);
      alert("Erro ao atualizar funcionário.");
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
            <FaBuilding /> Editar Funcionários
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
                      setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    <FaEdit /> Editar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-300 text-center">Nenhum funcionário encontrado.</p>
        )}

        {/* Modal de Edição */}
        {showModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#2A2D34] p-6 rounded-lg border border-gray-700 shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaUser /> Editar Funcionário
              </h2>

              {/* Nome */}
              <label className="block text-gray-300 mb-2">Nome</label>
              <input
                type="text"
                value={selectedEmployee.name}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none mb-3"
              />

              {/* Email */}
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={selectedEmployee.email}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none mb-3"
              />

              {/* Cargo */}
              <label className="block text-gray-300 mb-2">Cargo</label>
              <input
                type="text"
                value={selectedEmployee.occupation}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, occupation: e.target.value })}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none mb-3"
              />

              {/* Seletor de Departamento */}
              <label className="block text-gray-300 mb-2">Departamento</label>
              <div
                className="flex items-center justify-between p-3 bg-gray-800 text-white rounded-md border border-gray-600 cursor-pointer"
                onClick={() => setShowDepartments(!showDepartments)}
              >
                <span>
                  {selectedEmployee.departmentId
                    ? filteredDepartments.find(d => d.id === selectedEmployee.departmentId)?.name || "Departamento não encontrado"
                    : "Selecionar Departamento"}
                </span>
                {showDepartments ? <FaChevronUp /> : <FaChevronDown />}
              </div>

              {showDepartments && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-800 rounded-md border border-gray-600 max-h-40 overflow-y-auto mt-2 custom-scrollbar"
                >
                  {filteredDepartments.map((department) => (
                    <div
                      key={department.id}
                      className="p-3 hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setSelectedEmployee({ ...selectedEmployee, departmentId: department.id });
                        setShowDepartments(false);
                      }}
                    >
                      {department.name}
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Botões */}
              <div className="flex justify-end mt-4 space-x-4">
                <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition" onClick={handleSaveEmployee}>
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
