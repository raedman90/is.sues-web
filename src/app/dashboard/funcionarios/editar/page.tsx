"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { useDepartment } from "@/app/hooks/useDepartment";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaEdit, FaArrowLeft, FaUser, FaBuilding } from "react-icons/fa";
import { editEmployeeSchema } from "@/app/schemas/editEmployeeSchema";
import { z } from "zod";

export default function EditEmployees() {
  const { companyId, updateUser } = useAuth();
  const { departments, loadDepartments } = useDepartment();
  const router = useRouter();

  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!companyId) return;
      setLoading(true);

      try {
        await loadDepartments();
        const companyDepartments = departments.filter((dept) => dept.companyId === companyId);
        setFilteredDepartments(companyDepartments);

        if (companyDepartments.length > 0) {
          const employeesList = companyDepartments.flatMap((dept) =>
            dept.users?.map((user) => ({
              ...user,
              departmentName: dept.name,
              departmentId: dept.id,
            })) || []
          );

          setEmployees(employeesList);
        }
      } catch (error) {
        console.error("Erro ao carregar funcionários:", error);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchData();
    }
  }, [companyId, departments.length]); // Atualiza corretamente ao carregar os departamentos

  const handleSaveEmployee = async () => {
    if (!selectedEmployee) return;

    const validation = editEmployeeSchema.safeParse(selectedEmployee);
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
      await updateUser(
        selectedEmployee.id,
        selectedEmployee.name,
        selectedEmployee.occupation,
        selectedEmployee.email,
        selectedEmployee.departmentId
      );

      setEmployees((prev) =>
        prev.map((emp) => (emp.id === selectedEmployee.id ? { ...selectedEmployee } : emp))
      );

      setShowModal(false);
      setErrors({});
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
        {loading ? (
          <div className="flex justify-center items-center h-40 text-gray-300">Carregando funcionários...</div>
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
                      setSelectedEmployee({ ...employee });
                      setShowModal(true);
                      setErrors({});
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
              {errors.name && <p className="text-red-400 text-sm mb-3">{errors.name}</p>}

              {/* Seletor de Departamento */}
              <label className="block text-gray-300 mb-2">Departamento</label>
              <select
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none mb-3"
                value={selectedEmployee.departmentId}
                onChange={(e) =>
                  setSelectedEmployee({ ...selectedEmployee, departmentId: e.target.value })
                }
              >
                {filteredDepartments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>

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
