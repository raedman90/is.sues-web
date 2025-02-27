"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { useDepartment } from "@/app/hooks/useDepartment";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaUserPlus, FaBuilding, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { DepartmentDto } from "@/dtos/DepartmentDTO";

export default function CreateEmployee() {
  const { signUp } = useAuth();
  const { departments, loadDepartments } = useDepartment();
  const [filteredDepartments, setFilteredDepartments] = useState<DepartmentDto[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [occupation, setOccupation] = useState("");
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [showDepartments, setShowDepartments] = useState(false);
  const [error, setError] = useState<string | null>(null); // Estado para exibir erro no popup
  const router = useRouter();
  const { companyId } = useAuth();

  useEffect(() => {
    async function fetchDepartments() {
      await loadDepartments();
      if (companyId) {
        const filtered = departments.filter(dept => dept.companyId === companyId);
        setFilteredDepartments(filtered);
      }
    }
    fetchDepartments();
  }, [departments, companyId]);

  const handleCreateUser = async () => {
    if (!name) return setError("O campo Nome é obrigatório.");
    if (!email) return setError("O campo Email é obrigatório.");
    if (!password) return setError("O campo Senha é obrigatório.");
    if (!occupation) return setError("O campo Cargo é obrigatório.");
    if (!departmentId) return setError("Selecione um Departamento.");

    try {
      const isAdmin = false;
      await signUp(name, occupation, email, password, isAdmin, departmentId);
      setError(null);
      router.push("/dashboard/admin");
    } catch (error) {
      console.error(error);
      setError("Ocorreu um erro ao cadastrar o funcionário.");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 text-white flex flex-col gap-6 h-full max-w-2xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 border-b border-gray-700 pb-4 w-full max-w-3xl">
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

        {/* 🔹 Formulário com Scroll Interno */}
        <div className="w-full max-w-3xl bg-[#2A2D34] p-8 rounded-lg border border-gray-700 shadow-md mt-6">
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              
              {/* Nome */}
              <div>
                <label className="block text-gray-300 mb-2">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
                  placeholder="Nome do funcionário"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
                  placeholder="Email do funcionário"
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-gray-300 mb-2">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
                  placeholder="Senha de acesso"
                />
              </div>

              {/* Cargo */}
              <div>
                <label className="block text-gray-300 mb-2">Cargo</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
                  placeholder="Cargo do funcionário"
                />
              </div>

              {/* Seletor de Departamento (Dropdown) */}
              <div className="col-span-2 relative">
                <label className="block text-gray-300 mb-2">Departamento</label>
                <div
                  className="flex items-center justify-between p-3 bg-gray-800 text-white rounded-md border border-gray-600 cursor-pointer"
                  onClick={() => setShowDepartments(!showDepartments)}
                >
                  <span>
                    {departmentId
                      ? filteredDepartments.find(d => d.id === departmentId)?.name || "Departamento não encontrado"
                      : "Selecionar Departamento"}
                  </span>
                  {showDepartments ? <FaChevronUp /> : <FaChevronDown />}
                </div>

                {showDepartments && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 w-full bg-gray-800 rounded-md border border-gray-600 max-h-40 overflow-y-auto mt-2 custom-scrollbar"
                  >
                    {filteredDepartments.length > 0 ? (
                      filteredDepartments.map((department) => (
                        <div
                          key={department.id}
                          className="p-3 hover:bg-gray-700 cursor-pointer"
                          onClick={() => {
                            if (department.id) {
                              setDepartmentId(department.id);
                              setShowDepartments(false);
                            }
                          }}
                        >
                          {department.name}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center p-3">Nenhum departamento encontrado.</p>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Botão de Cadastro */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
            onClick={handleCreateUser}
          >
            <FaUserPlus /> Cadastrar Funcionário
          </motion.button>
        </div>

        {/* 🔴 POPUP MODAL PARA ERRO */}
        {error && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center">
              <p className="text-red-400 text-lg">{error}</p>
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                onClick={() => setError(null)}
              >
                OK
              </button>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
