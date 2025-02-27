"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { useCompany } from "@/app/hooks/useCompany";
import { getCompany } from "@/api/apiCompany";
import CompanyMap from "@/components/Map";
import { motion } from "framer-motion";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { CompanyDto } from "@/dtos/CompanyDTO";
import Popup from "@/components/popup/popup";

export default function EditCompany() {
  const { companyId } = useAuth();
  const { updateCompany } = useCompany();

  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    async function fetchCompanyData() {
      if (!companyId) return;

      try {
        const companyData = await getCompany(companyId);
        setCompany({
          ...companyData,
          latitude: companyData.latitude ?? 0,
          longitude: companyData.longitude ?? 0,
        });
      } catch (error) {
        console.error("Erro ao carregar empresa:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyData();
  }, [companyId]);

  const handleSaveChanges = async () => {
    if (!company || !company.name || !company.email) {
      setPopupMessage("Todos os campos obrigatórios devem ser preenchidos.");
      setShowPopup(true);
      return;
    }

    try {
      await updateCompany(companyId as string, company);
      setPopupMessage("Empresa atualizada com sucesso!");
      setShowPopup(true);
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error);
      setPopupMessage("Erro ao atualizar a empresa.");
      setShowPopup(true);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen text-white">
          Carregando informações...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 text-white flex flex-col gap-6 h-full max-w-2xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 border-b border-gray-700 pb-4 w-full">
          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white transition"
          >
            <FaArrowLeft size={20} />
          </motion.button>
          <h1 className="text-2xl font-bold">Editar Empresa</h1>
        </div>

        {/* Formulário com Scroll Customizado */}
        <div className="bg-[#2A2D34] p-6 rounded-lg border border-gray-700 shadow-md max-h-[500px] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 gap-6">
            
            {/* Nome */}
            <div>
              <label className="block text-gray-300 mb-2">Nome da Empresa</label>
              <input
                type="text"
                value={company?.name || ""}
                onChange={(e) => setCompany({ ...company!, name: e.target.value })}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
                placeholder="Nome da empresa"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 mb-2">Email da Empresa</label>
              <input
                type="email"
                value={company?.email || ""}
                onChange={(e) => setCompany({ ...company!, email: e.target.value })}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
                placeholder="Email da empresa"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-gray-300 mb-2">Descrição</label>
              <textarea
                value={company?.description || ""}
                onChange={(e) => setCompany({ ...company!, description: e.target.value })}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
                placeholder="Descrição da empresa"
              ></textarea>
            </div>

            {/* Mapa dentro da área scrollável */}
            <div>
              <label className="block text-gray-300 mb-2">Localização da Empresa</label>
              <div className="h-72 overflow-hidden rounded-lg border border-gray-600">
                <CompanyMap
                  onLocationSelect={(lat, lng) => setCompany({ ...company!, latitude: lat, longitude: lng })}
                />
              </div>
            </div>

          </div>

          {/* Botão de salvar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
            onClick={handleSaveChanges}
          >
            <FaSave /> Salvar Alterações
          </motion.button>
        </div>

      </div>

      {/* Popup de Confirmação */}
      {showPopup && (
        <Popup message={popupMessage} onClose={() => setShowPopup(false)} />
      )}
    </DashboardLayout>
  );
}
