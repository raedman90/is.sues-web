"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useIssues } from "@/app/contexts/IssuesContext";
import { useAuth } from "@/app/hooks/useAuth";
import IssuesList from "@/components/issues/IssuesList";
import { Issue } from "@/dtos/IssueDTO";
import { FaList, FaUserCheck } from "react-icons/fa";


export default function Dashboard() {
  const { issues, loadIssues } = useIssues();
  const { user } = useAuth(); // Pegamos os dados do usuário autenticado

  const [viewMode, setViewMode] = useState<"all" | "assigned">("all");
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "progress" | "closed">("all");

  useEffect(() => {
    if (issues.length === 0) {
      loadIssues();
    }
  }, [issues, loadIssues]);

  useEffect(() => {
    let filtered: Issue[] = issues;

    filtered = filtered.filter((issue) => {
      if (user?.departmentId && issue.departmentId === user.departmentId) return true;
      return false;
    });

    if (viewMode === "assigned") {
      filtered = filtered.filter((issue) => issue.isAssigned);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((issue) => {
        if (statusFilter === "open") return !issue.status;
        if (statusFilter === "progress") return issue.status && !issue.isAssigned;
        if (statusFilter === "closed") return issue.isAssigned;
        return true;
      });
    }

    setFilteredIssues(filtered);
  }, [statusFilter, viewMode, issues, user]);

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
        </div>

        {/* Lista de Issues com Scroll */}
        <div className="flex-1 overflow-y-auto bg-[#1B1D21] rounded-md p-4 border border-gray-700">
          <IssuesList issues={filteredIssues} />
        </div>
      </div>
    </DashboardLayout>
  );
}
