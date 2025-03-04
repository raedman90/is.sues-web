"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useIssues } from "@/app/contexts/IssuesContext";
import { useAuth } from "@/app/hooks/useAuth";
import { useDepartment } from "@/app/hooks/useDepartment";
import IssuesList from "@/components/issues/IssuesList";
import { Issue } from "@/dtos/IssueDTO";
import { FaList, FaUserCheck, FaRedoAlt } from "react-icons/fa";
import { getAllDepartments } from "@/api/department";

export default function Dashboard() {
  const { issues, loadIssues } = useIssues();
  const { user } = useAuth();
  const { departments, loadDepartments } = useDepartment();

  const [viewMode, setViewMode] = useState<"all" | "assigned">("all");
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "progress" | "closed">("all");
  const [companyDepartments, setCompanyDepartments] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!user?.departmentId) return;
  
      try {
        await loadDepartments();
        await loadIssues();
  
        // 🔹 Obtém todos os departamentos disponíveis
        const allDepartments = await getAllDepartments();
        const userDepartment = allDepartments.find((dept) => dept.id === user.departmentId);
  
        if (!userDepartment) return;
  
        // 🔹 Filtra os departamentos pertencentes à mesma empresa
        const companyDepartments = allDepartments
          .filter((dept) => dept.companyId === userDepartment.companyId)
          .map((dept) => dept.id);
  
        setCompanyDepartments(companyDepartments);
      } catch (error) {
        console.error("Erro ao carregar departamentos e issues:", error);
      }
    }
  
    fetchData();
  }, [user, loadDepartments, loadIssues]);

  useEffect(() => {
    let filtered: Issue[] = issues;
  
    // 🔹 Filtra as issues que pertencem à empresa do usuário
    if (companyDepartments.length > 0) {
      filtered = filtered.filter((issue) => companyDepartments.includes(issue.departmentId || ""));
    }
  
    // 🔹 Filtra por issues atribuídas
    if (viewMode === "assigned") {
      filtered = filtered.filter((issue) => issue.isAssigned);
    }
  
    // 🔹 Filtra por status da issue
    if (statusFilter !== "all") {
      filtered = filtered.filter((issue) => {
        if (statusFilter === "open") return !issue.isAssigned && !issue.status;
        if (statusFilter === "progress") return issue.status && !issue.isAssigned;
        if (statusFilter === "closed") return issue.isAssigned;
        return true;
      });
    }
  
    setFilteredIssues(filtered);
  }, [statusFilter, viewMode, issues, companyDepartments]);

  const handleResetFilters = () => {
    setViewMode("all");
    setStatusFilter("all");
  };

  return (
    <DashboardLayout>
      <div className="p-6 text-white flex flex-col h-full max-w-7xl mx-auto w-full">
        {/* Filtros no topo */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
          {/* Botões de ViewMode (Todas e Assinadas) */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setViewMode("all")}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition ${
                viewMode === "all" ? "bg-[#7864F4] text-white font-semibold" : "bg-gray-700 text-gray-300"
              }`}
            >
              <FaList />
              Todas ({filteredIssues.length})
            </button>
            <button
              onClick={() => setViewMode("assigned")}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition ${
                viewMode === "assigned" ? "bg-[#7864F4] text-white font-semibold" : "bg-gray-700 text-gray-300"
              }`}
            >
              <FaUserCheck />
              Assinadas ({filteredIssues.filter((issue) => issue.isAssigned).length})
            </button>
          </div>

          {/* Filtros de Status */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("open")}
              className={`px-4 py-2 rounded-md transition ${
                statusFilter === "open" ? "bg-green-500 text-white font-semibold" : "bg-gray-700 text-gray-300"
              }`}
            >
              Abertas
            </button>
            <button
              onClick={() => setStatusFilter("progress")}
              className={`px-4 py-2 rounded-md transition ${
                statusFilter === "progress" ? "bg-yellow-500 text-white font-semibold" : "bg-gray-700 text-gray-300"
              }`}
            >
              Em Progresso
            </button>
            <button
              onClick={() => setStatusFilter("closed")}
              className={`px-4 py-2 rounded-md transition ${
                statusFilter === "closed" ? "bg-red-500 text-white font-semibold" : "bg-gray-700 text-gray-300"
              }`}
            >
              Concluídas
            </button>
          </div>

          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md flex items-center gap-2 hover:bg-gray-700 transition"
          >
            <FaRedoAlt /> Resetar Filtros
          </button>
        </div>

        {/* Lista de Issues com Scroll */}
        <div className="flex-1 overflow-y-auto bg-[#1B1D21] rounded-md p-4 border border-gray-700">
          <IssuesList issues={filteredIssues} />
        </div>
      </div>
    </DashboardLayout>
  );
}
