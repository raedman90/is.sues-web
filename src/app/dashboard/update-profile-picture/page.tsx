"use client";

import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { motion } from "framer-motion";
import { FaUpload, FaTimes } from "react-icons/fa";

export default function UpdateProfilePicturePage({ onClose }: { onClose: () => void }) {
  const { user, updateProfilePicture } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  //Função para lidar com a seleção da imagem
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; 
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  // Função para fazer o upload da imagem
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Nenhuma imagem selecionada.");
      return;
    }

    try {
      await updateProfilePicture(user?.id!, selectedFile);
      alert("Foto de perfil atualizada com sucesso!");
      onClose(); 
    } catch (error) {
      console.error("Erro ao atualizar a foto de perfil:", error);
      alert("Erro ao atualizar a imagem.");
    }
  };

  return (
    <div className="p-6 bg-[#2A2D34] rounded-lg border border-gray-700 max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-white mb-4">Alterar Foto de Perfil</h2>

      {/* Pré-visualização da imagem */}
      <div className="flex flex-col items-center gap-3">
        <motion.img
          src={preview || user?.photo || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
          alt="Foto de Perfil"
          className="w-32 h-32 rounded-full border-4 border-gray-600 shadow-lg object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-gray-300 cursor-pointer"
        />
      </div>

      {/* Botões de ação */}
      <div className="flex justify-between mt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          onClick={onClose}
        >
          <FaTimes /> Cancelar
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          onClick={handleUpload}
        >
          <FaUpload /> Atualizar
        </motion.button>
      </div>
    </div>
  );
}
