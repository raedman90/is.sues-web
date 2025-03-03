"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useIssues } from "@/app/contexts/IssuesContext";
import { useAuth } from "@/app/hooks/useAuth";
import { useDepartment } from "@/app/hooks/useDepartment";
import IssuesList from "@/components/issues/IssuesList";
import { Issue } from "@/dtos/IssueDTO";
import { FaList, FaUserCheck, FaRedoAlt } from "react-icons/fa";

export default function Dashboard() {
  const { issues, loadIssues } = useIssues();
  const { user } = useAuth();
  const { departments, loadDepartments } = useDepartment();

  const [viewMode, setViewMode] = useState<"all" | "assigned">("all");
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "progress" | "closed">("all");
  const [companyDepartments, setCompanyDepartments] = useState<string[]>([]);

  useEffect(() => {
    if (issues.length === 0) {
      loadIssues();
    }

    async function fetchDepartments() {
      await loadDepartments();

      const storedCompanyId = localStorage.getItem("companyId");

      if (storedCompanyId) {
        const filteredDepartments = departments
          .filter((dept) => dept.companyId === storedCompanyId)
          .map((dept) => dept.id)
          .filter(Boolean) as string[];

        setCompanyDepartments(filteredDepartments);
      }
    }

    fetchDepartments();
  }, [issues, loadIssues, departments, loadDepartments]);

  useEffect(() => {
    let filtered: Issue[] = issues;

    if (companyDepartments.length > 0) {
      filtered = filtered.filter((issue) => companyDepartments.includes(issue.departmentId || ""));
    } else if (user?.departmentId) {
      filtered = filtered.filter((issue) => issue.departmentId === user.departmentId);
    }

    if (viewMode === "assigned") {
      filtered = filtered.filter((issue) => issue.isAssigned);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((issue) => {
        if (statusFilter === "open") return !issue.isAssigned && !issue.status;
        if (statusFilter === "progress") return issue.status && !issue.isAssigned;
        if (statusFilter === "closed") return issue.isAssigned;
        return true;
      });
    }

    setFilteredIssues(filtered);
  }, [statusFilter, viewMode, issues, user, companyDepartments]);

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
