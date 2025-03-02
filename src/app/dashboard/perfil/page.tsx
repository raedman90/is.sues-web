"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { useDepartment } from "@/app/hooks/useDepartment";
import UpdateProfilePicturePage from "@/app/dashboard/update-profile-picture/page";
import { motion } from "framer-motion";
import { FaUserEdit, FaEnvelope, FaBriefcase, FaBuilding } from "react-icons/fa";

export default function ProfilePage() {
  const { user } = useAuth();
  const { getDepartmentById } = useDepartment(); // Hook para buscar departamento
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [departmentName, setDepartmentName] = useState<string>("Carregando...");

  // Buscar o nome do departamento ao carregar a página
  useEffect(() => {
    async function fetchDepartmentName() {
      if (user?.departmentId) {
        try {
          const department = await getDepartmentById(user.departmentId);
          setDepartmentName(department?.name || "Departamento não encontrado");
        } catch (error) {
          console.error("Erro ao buscar departamento:", error);
          setDepartmentName("Erro ao carregar");
        }
      } else {
        setDepartmentName("Não definido");
      }
    }
    fetchDepartmentName();
  }, [user?.departmentId]);

  const handleOpenEditPhoto = () => {
    setIsEditingPhoto(true);
  };

  return (
    <DashboardLayout>
      <div className="p-6 text-white flex flex-col gap-6 max-w-2xl mx-auto">
        
        {/* Título */}
        <h1 className="text-2xl font-bold border-b border-gray-700 pb-4">Meu Perfil</h1>

        {/* 📌 Imagem de Perfil (clicável para editar) */}
        <div className="relative flex flex-col items-center">
          <motion.img
            src={user?.photo || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
            alt="Foto de Perfil"
            className="w-32 h-32 rounded-full border-4 border-gray-600 shadow-lg cursor-pointer object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            onClick={handleOpenEditPhoto}
          />
          <p className="text-gray-400 mt-2 text-sm">Clique na foto para alterar</p>
        </div>

        {/* Informações do Usuário */}
        <div className="bg-[#2A2D34] p-6 rounded-lg border border-gray-700 shadow-md">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FaUserEdit /> <span className="text-gray-300">Nome:</span> {user?.name}
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope /> <span className="text-gray-300">Email:</span> {user?.email}
            </div>
            <div className="flex items-center gap-2">
              <FaBriefcase /> <span className="text-gray-300">Cargo:</span> {user?.occupation}
            </div>
            <div className="flex items-center gap-2">
              <FaBuilding /> <span className="text-gray-300">Departamento:</span> {departmentName}
            </div>
          </div>
        </div>
      </div>

      {/* 📌 Modal para Editar Foto */}
      {isEditingPhoto && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#2A2D34] p-6 rounded-lg border border-gray-700 max-w-lg w-full">
            <UpdateProfilePicturePage onClose={() => setIsEditingPhoto(false)} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
