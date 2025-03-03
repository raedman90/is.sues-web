"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useIssues } from "@/app/contexts/IssuesContext";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { getIssue, updateIssue, getAuthorIssue } from "@/api/issues";
import { FaCheckCircle, FaEdit, FaUserTimes, FaSignInAlt, FaClock } from "react-icons/fa";
import { Issue } from "@/dtos/IssueDTO";

export default function IssueDetails() {
  const { user } = useAuth();
  const { loadIssues } = useIssues();
  const { id } = useParams();
  const router = useRouter();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState<string>("Carregando...");

  // Função para carregar os dados mais recentes da issue
  const fetchIssueData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const fetchedIssue = await getIssue(id as string);
      setIssue(fetchedIssue);

      // Buscar nome do autor
      const author = await getAuthorIssue(fetchedIssue.authorId);
      setAuthorName(author || "Desconhecido");
    } catch (error) {
      console.error("Erro ao buscar a issue:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssueData();
  }, [id]);

  const handleEditIssue = () => {
    if (!issue?.id) return;
    router.push(`/dashboard/issues/${issue.id}/edit`);
  };

  const handleAssumeIssue = async () => {
    if (!issue) return;
    try {
      const updatedIssue = { ...issue, status: true, assignedUserId: user?.id, isAssigned: false };
  
      console.log("🛠️ Dados enviados para updateIssue:", updatedIssue);
  
      await updateIssue(updatedIssue);
      await fetchIssueData(); 
      await loadIssues();
    } catch (error) {
      console.error("❌ Erro ao assumir a issue:", error);
    }
  };
  


  const handleAssignIssue = async () => {
    if (!issue) return;
    try {
      await updateIssue({ ...issue, status: true, assignedUserId: user?.id, isAssigned: true });
      await fetchIssueData(); 
      await loadIssues();
    } catch (error) {
      console.error("Erro ao assinar a issue:", error);
    }
  };

  const handleDropIssue = async () => {
    if (!issue) return;
    try {
      await updateIssue({ ...issue, status: false, assignedUserId: null, isAssigned: false });
      await fetchIssueData();
      await loadIssues();
    } catch (error) {
      console.error("Erro ao abandonar a issue:", error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen text-white text-lg">
          Carregando informações da issue...
        </div>
      </DashboardLayout>
    );
  }

  if (!issue) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen text-red-500 text-lg">
          Issue não encontrada.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto bg-[#1B1D21] text-white rounded-lg shadow-md">
        {/* Título da Issue */}
        <h1 className="text-3xl font-bold text-[#EAEAEA] mb-4">{issue.title}</h1>

        {/* Informações da Issue */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#25272B] p-4 rounded-lg mb-6">
          <div className="text-sm text-gray-400">
            <p>
              <FaClock className="inline-block mr-2" />
              Aberta em:{" "}
              {issue.createdAt
                ? new Date(issue.createdAt).toLocaleString("pt-BR")
                : "Data não disponível"}
            </p>
            <p>Por: {authorName}</p>
          </div>

          {/* Status da Issue */}
          <div className="mt-4 md:mt-0">
            {issue.isAssigned ? (
              <span className="px-4 py-2 text-sm rounded-md bg-blue-500 text-white flex items-center gap-2">
                <FaCheckCircle /> Concluída
              </span>
            ) : issue.status ? (
              <span className="px-4 py-2 text-sm rounded-md bg-yellow-500 text-black">
                Em progresso
              </span>
            ) : (
              <span className="px-4 py-2 text-sm rounded-md bg-green-500 text-white">Aberta</span>
            )}
          </div>
        </div>
        {/* Descrição da Issue */}
<div className="bg-[#2D2F33] p-4 rounded-lg mt-4">
  <h2 className="text-xl font-semibold text-[#EAEAEA] mb-2">Descrição:</h2>
  <p className="text-gray-300">{issue.description ? issue.description : "Sem descrição disponível."}</p>
</div>

        {/* Ações */}
        <div className="flex flex-wrap gap-3 mt-6">
          {issue.authorId === user?.id && !issue.status && !issue.isAssigned && (
            <button
              className="bg-blue-500 text-white px-5 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600 transition"
              onClick={handleEditIssue}
            >
              <FaEdit /> Editar Issue
            </button>
          )}

          {!issue.status && issue.departmentId === user?.departmentId && (
            <button
              className="bg-green-500 text-white px-5 py-2 rounded-md flex items-center gap-2 hover:bg-green-600 transition"
              onClick={handleAssumeIssue}
            >
              <FaSignInAlt /> Assumir Issue
            </button>
          )}

          {issue.status && issue.assignedUserId === user?.id && !issue.isAssigned && (
            <>
              <button
                className="bg-purple-500 text-white px-5 py-2 rounded-md flex items-center gap-2 hover:bg-purple-600 transition"
                onClick={handleAssignIssue}
              >
                <FaCheckCircle /> Assinar Issue
              </button>
              <button
                className="bg-red-500 text-white px-5 py-2 rounded-md flex items-center gap-2 hover:bg-red-600 transition"
                onClick={handleDropIssue}
              >
                <FaUserTimes /> Abandonar Issue
              </button>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
