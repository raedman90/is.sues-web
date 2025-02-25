"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { getCompany } from "@/api/apiCompany";
import { getDepartmentName } from "@/api/department";
import { CompanyDto } from "@/dtos/CompanyDTO";
import dynamic from "next/dynamic";
import { FaBuilding, FaEnvelope, FaInfoCircle, FaList, FaTools } from "react-icons/fa";

// Importação dinâmica do mapa para evitar erro no Next.js
const Map = dynamic(() => import("@/components/company/Map"), { ssr: false });

export default function CompanyPage() {
  const { user, companyId } = useAuth();
  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"description" | "departments">("description");
  const router = useRouter();

  useEffect(() => {
    async function fetchCompanyData() {
      if (!companyId) {
        console.error("Nenhuma empresa vinculada ao usuário.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Buscar dados da empresa
        const companyData = await getCompany(companyId);
        setCompany(companyData);

        // Se o usuário tiver um departmentId, buscar nome do departamento
        if (user?.departmentId) {
          const departmentName = await getDepartmentName(user.departmentId);
          setDepartments([departmentName]); // Como não há rota para múltiplos departamentos, retorna um array com um único item
        }
      } catch (error) {
        console.error("Erro ao carregar empresa:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyData();
  }, [companyId, user?.departmentId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full text-white">
          Carregando informações...
        </div>
      </DashboardLayout>
    );
  }

  if (!company) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full text-white">
          ❌ Empresa não encontrada.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 text-white flex flex-col gap-6 h-full">
        {/* Nome da Empresa e E-mail */}
        <div className="flex items-center justify-between border-b border-gray-700 pb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaBuilding /> {company.name}
          </h1>
          <span className="text-gray-400 flex items-center gap-2">
            <FaEnvelope /> {company.email || "E-mail indisponível"}
          </span>
        </div>

        {/* Mapa Sempre Visível */}
        {company.latitude && company.longitude && (
          <div className="h-[400px] w-full rounded-lg overflow-hidden">
            <Map latitude={company.latitude} longitude={company.longitude} />
          </div>
        )}

        {/* Botões de Alternância Centralizados */}
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => setView("description")}
            className={`px-6 py-3 flex items-center gap-2 rounded-md transition ${
              view === "description" ? "bg-[#7864F4] text-white font-semibold" : "bg-gray-700 text-gray-300"
            }`}
          >
            <FaInfoCircle />
            Descrição
          </button>
          <button
            onClick={() => setView("departments")}
            className={`px-6 py-3 flex items-center gap-2 rounded-md transition ${
              view === "departments" ? "bg-[#7864F4] text-white font-semibold" : "bg-gray-700 text-gray-300"
            }`}
          >
            <FaList />
            Departamentos
          </button>

          {/* Botão do Painel Administrativo (somente para o Head da empresa) */}
          {user?.id === company.headid && (
            <button
              className="px-6 py-3 flex items-center gap-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              onClick={() => router.push("/dashboard/admin")}
            >
              <FaTools />
              Painel Administrativo
            </button>
          )}
        </div>

        {/* 📌 Container para Conteúdo Alternado */}
        <div className="p-4 bg-[#2A2D34] rounded-md border border-gray-700 mt-4 w-full max-h-[300px] overflow-y-auto">
          {view === "description" ? (
            <>
              <h3 className="text-lg font-semibold mb-2">Descrição da Empresa</h3>
              <p className="text-gray-300">{company.description || "Nenhuma descrição disponível."}</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-2">Departamentos</h3>
              {departments.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {departments.map((dept, index) => (
                    <li key={index} className="text-gray-300">{dept}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300">Nenhum departamento encontrado.</p>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
