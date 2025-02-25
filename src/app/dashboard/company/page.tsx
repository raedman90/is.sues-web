"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { getCompany, getCompanyByDep } from "@/api/apiCompany";
import { CompanyDto } from "@/dtos/CompanyDTO";
import { DepartmentDto } from "@/dtos/DepartmentDTO";
import dynamic from "next/dynamic";
import { FaBuilding, FaInfoCircle, FaList, FaTools } from "react-icons/fa";

// Importando dinamicamente o mapa (corrige erro do Next.js com Leaflet)
const Map = dynamic(() => import("@/components/company/Map"), { ssr: false });

export default function CompanyPage() {
  const { user } = useAuth();
  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"map" | "description" | "departments">("map");

  useEffect(() => {
    async function fetchCompanyData() {
      setLoading(true);
      try {
        let companyData: CompanyDto | null = null;

        if (user?.departmentId) {
          // Se o usuário pertence a um departamento, buscar empresa pelo departamento
          companyData = await getCompanyByDep(user.departmentId);
        } else if (user?.id) {
          // Se não, tentar buscar empresa pelo ID da empresa vinculada ao usuário
          companyData = await getCompany(user.id);
        }

        if (companyData) {
          setCompany(companyData);
        }
      } catch (error) {
        console.error("Erro ao carregar empresa:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyData();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full text-white">Carregando informações...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 text-white flex flex-col gap-6">
        {/* Nome da Empresa e Usuário */}
        <div className="flex items-center justify-between border-b border-gray-700 pb-4">
          <h1 className="text-2xl font-bold">{company?.name || "Empresa não encontrada"}</h1>
          <span className="text-gray-400">{user?.name}</span>
        </div>

        {/* Mapa */}
        {view === "map" && company?.latitude && company?.longitude && (
          <div className="h-[400px] w-full">
            <Map latitude={company.latitude} longitude={company.longitude} />
          </div>
        )}

        {/* Botões de Alternância */}
        <div className="flex space-x-4">
          <button
            onClick={() => setView("description")}
            className={`px-4 py-2 flex items-center gap-2 rounded-md transition ${
              view === "description" ? "bg-[#7864F4] text-white font-semibold" : "bg-gray-700 text-gray-300"
            }`}
          >
            <FaInfoCircle />
            Descrição
          </button>
          <button
            onClick={() => setView("departments")}
            className={`px-4 py-2 flex items-center gap-2 rounded-md transition ${
              view === "departments" ? "bg-[#7864F4] text-white font-semibold" : "bg-gray-700 text-gray-300"
            }`}
          >
            <FaList />
            Departamentos
          </button>

          {/* Botão do Painel Administrativo (visível apenas para o Head) */}
          {user?.id === company?.headid && (
            <button
              className="px-4 py-2 flex items-center gap-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              onClick={() => alert("Futuro Painel Administrativo")}
            >
              <FaTools />
              Painel Administrativo
            </button>
          )}
        </div>

        {/* Conteúdo Alternado */}
        {view === "description" && (
          <div className="p-4 bg-[#2A2D34] rounded-md border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Descrição da Empresa</h3>
            <p className="text-gray-300">{company?.description || "Nenhuma descrição disponível."}</p>
          </div>
        )}

        {view === "departments" && (
          <div className="p-4 bg-[#2A2D34] rounded-md border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Departamentos</h3>
            {departments.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {departments.map((dept) => (
                  <li key={dept.id} className="text-gray-300">{dept.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-300">Nenhum departamento encontrado.</p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
