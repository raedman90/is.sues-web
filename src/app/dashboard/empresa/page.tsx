"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { getCompany } from "@/api/apiCompany";
import { useDepartment } from "@/app/hooks/useDepartment";
import { CompanyDto } from "@/dtos/CompanyDTO";
import dynamic from "next/dynamic";
import { FaBuilding, FaEnvelope, FaInfoCircle, FaList, FaTools } from "react-icons/fa";

const Map = dynamic(() => import("@/components/company/Map"), { ssr: false });

export default function CompanyPage() {
  const { user } = useAuth();
  const { getDepartmentById, loadDepartments, departments } = useDepartment();
  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [companyDepartments, setCompanyDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"description" | "departments">("description");
  const router = useRouter();

  useEffect(() => {
    async function fetchCompanyData() {
      setLoading(true);
      let companyIdToFetch: string | null = null;

      try {
        if (user?.id) {
          try {
            const companyData = await getCompany(user.id);
            if (companyData?.id) {
              companyIdToFetch = companyData.id;
              setCompany(companyData);
            }
          } catch (error) {
            console.warn("Usuário não é headid de nenhuma empresa.");
          }
        }

        if (!companyIdToFetch && user?.departmentId) {
          const department = await getDepartmentById(user.departmentId);
          if (department?.companyId) {
            companyIdToFetch = department.companyId;
            const companyData = await getCompany(companyIdToFetch);
            setCompany(companyData);
          }
        }

        if (!companyIdToFetch) {
          const storedCompanyId = localStorage.getItem("companyId");
          if (storedCompanyId) {
            companyIdToFetch = storedCompanyId;
            const companyData = await getCompany(companyIdToFetch);
            setCompany(companyData);
          }
        }

        if (!companyIdToFetch) {
          console.error("❌ Usuário não tem empresa vinculada.");
        }
      } catch (error) {
        console.error("❌ Erro ao carregar empresa:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyData();
  }, [user]);

  useEffect(() => {
    async function fetchDepartments() {
      if (!company?.id) return;

      try {
        await loadDepartments();
        const filteredDepartments = departments
          .filter((dept) => dept.companyId === company.id)
          .map((dept) => dept.name);

        setCompanyDepartments(filteredDepartments);
      } catch (error) {
        console.error("❌ Erro ao carregar departamentos:", error);
      }
    }

    fetchDepartments();
  }, [company, departments, loadDepartments]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen text-white">
          🔄 Carregando informações...
        </div>
      </DashboardLayout>
    );
  }

  if (!company) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen text-white">
          ❌ Empresa não encontrada.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 text-white flex flex-col gap-6 max-w-4xl mx-auto h-full">
        {/* Nome da Empresa e E-mail */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-700 pb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaBuilding /> {company.name}
          </h1>
          <span className="text-gray-400 flex items-center gap-2">
            <FaEnvelope /> {company.email || "E-mail indisponível"}
          </span>
        </div>

        {/* Mapa */}
        {company.latitude && company.longitude && (
          <div className="h-[400px] w-full rounded-lg overflow-hidden relative z-10">
            <Map latitude={company.latitude} longitude={company.longitude} />
          </div>
        )}

        {/* Botões de Alternância */}
        <div className="flex justify-center space-x-4 mt-4 flex-wrap">
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

          {/* Painel Administrativo */}
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

        {/* Conteúdo alternável */}
        <div
          className="p-4 bg-[#2A2D34] rounded-md border border-gray-700 mt-4 w-full overflow-y-auto custom-scrollbar"
          style={{ maxHeight: "300px", minHeight: "150px" }}
        >
          {view === "description" ? (
            <>
              <h3 className="text-lg font-semibold mb-2">Descrição da Empresa</h3>
              <p className="text-gray-300">{company.description || "Nenhuma descrição disponível."}</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-2">Departamentos</h3>
              {companyDepartments.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {companyDepartments.map((dept, index) => (
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
