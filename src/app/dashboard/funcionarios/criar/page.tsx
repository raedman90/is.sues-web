"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { useDepartment } from "@/app/hooks/useDepartment";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaUserPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { employeeSchema } from "@/app/schemas/employeeSchema";
import { DepartmentDto } from "@/dtos/DepartmentDTO";
import { z } from "zod";

export default function CreateEmployee() {
  const { signUp } = useAuth();
  const { departments, loadDepartments } = useDepartment();
  const [filteredDepartments, setFilteredDepartments] = useState<DepartmentDto[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    occupation: "",
    departmentId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDepartments, setShowDepartments] = useState(false);
  const router = useRouter();
  const { companyId } = useAuth();

  useEffect(() => {
    async function fetchDepartments() {
      await loadDepartments();
      if (companyId && departments.length > 0) {
        const filtered = departments.filter((dept) => dept.companyId === companyId);
        setFilteredDepartments(filtered);
      }
    }
    fetchDepartments();
  }, [departments, companyId]);

  const handleCreateUser = async () => {
    const validation = employeeSchema.safeParse(formData);
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
      await signUp(
        formData.name,
        formData.occupation,
        formData.email,
        formData.password,
        false,
        formData.departmentId
      );
      router.push("/dashboard/admin");
    } catch (error) {
      console.error(error);
      setErrors({ form: "Ocorreu um erro ao cadastrar o funcionário." });
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
            <FaUserPlus /> Cadastrar Funcionário
          </h1>
        </div>

        {/* Formulário */}
        <div className="w-full max-w-3xl bg-[#2A2D34] p-6 rounded-lg border border-gray-700 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Nome */}
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
                placeholder="Nome do funcionário"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
                placeholder="Email do funcionário"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-gray-300 mb-2">Senha</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
                placeholder="Senha de acesso"
              />
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Cargo */}
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">Cargo</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
                placeholder="Cargo do funcionário"
              />
              {errors.occupation && <p className="text-red-400 text-sm mt-1">{errors.occupation}</p>}
            </div>

            {/* Seletor de Departamento */}
            <div className="md:col-span-2 relative">
              <label className="block text-gray-300 mb-2">Departamento</label>
              <div
                className="flex items-center justify-between p-3 bg-gray-800 text-white rounded-md border border-gray-600 cursor-pointer"
                onClick={() => setShowDepartments(!showDepartments)}
              >
                <span>
                  {formData.departmentId
                    ? filteredDepartments.find((d) => d.id === formData.departmentId)?.name || "Departamento não encontrado"
                    : "Selecionar Departamento"}
                </span>
                {showDepartments ? <FaChevronUp /> : <FaChevronDown />}
              </div>

              {showDepartments && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 w-full bg-gray-800 rounded-md border border-gray-600 max-h-40 overflow-y-auto custom-scrollbar mt-2"
                >
                  {filteredDepartments.map((department) => (
                    <div
                      key={department.id}
                      className="p-3 hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setFormData({ ...formData, departmentId: department.id || "" });
                        setShowDepartments(false);
                      }}
                    >
                      {department.name}
                    </div>
                  ))}
                </motion.div>
              )}
              {errors.departmentId && <p className="text-red-400 text-sm mt-1">{errors.departmentId}</p>}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="w-full mt-6 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
            onClick={handleCreateUser}
          >
            <FaUserPlus /> Cadastrar Funcionário
          </motion.button>
        </div>
      </div>
    </DashboardLayout>
  );
}
