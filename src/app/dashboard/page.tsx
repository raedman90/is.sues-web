"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useIssues } from "@/app/contexts/IssuesContext";
import IssuesList from "@/components/issues/IssuesList";
import { Issue } from "@/dtos/IssueDTO";
import { FaList, FaUserCheck } from "react-icons/fa";

export default function Dashboard() {
  const { issues, loadIssues } = useIssues();

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

    if (viewMode === "assigned") {
      filtered = issues.filter((issue) => issue.isAssigned);
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
  }, [statusFilter, viewMode, issues]);

  return (
    <DashboardLayout>
      <div className="p-6 text-white flex flex-col h-full">
        {/* Filtros no topo */}
        <div className="flex justify-between items-center mb-4">
          {/* Botões de ViewMode (Todas e Assinadas) */}
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode("all")}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition ${
                viewMode === "all" ? "bg-[#7864F4] text-white font-semibold" : "bg-gray-700 text-gray-300"
              }`}
            >
              <FaList />
              Todas ({issues.length})
            </button>
            <button
              onClick={() => setViewMode("assigned")}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition ${
                viewMode === "assigned" ? "bg-[#7864F4] text-white font-semibold" : "bg-gray-700 text-gray-300"
              }`}
            >
              <FaUserCheck />
              Assinadas ({issues.filter((issue) => issue.isAssigned).length})
            </button>
          </div>

          {/* Filtros de Status */}
          <div className="flex space-x-2">
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
