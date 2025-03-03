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
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState<string>("Carregando...");
  const router = useRouter();

  useEffect(() => {
    async function fetchIssueData() {
      if (!id) return;
      try {
        const fetchedIssue = await getIssue(id as string);
        setIssue(fetchedIssue);

        // Buscar nome do autor pela API
        const author = await getAuthorIssue(fetchedIssue.authorId);
        setAuthorName(author || "Desconhecido");
      } catch (error) {
        console.error("Erro ao buscar a issue:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchIssueData();
  }, [id, user]);

  const handleEditIssue = () => {
    if (!issue || !issue.id) return;
    router.push(`/dashboard/issues/${issue.id}/edit`);
  };

  const handleAssumeIssue = async () => {
    if (!issue) return;
    try {
      const updatedIssue = { ...issue, status: true, assignedUserId: user?.id };
      await updateIssue(updatedIssue);
      setIssue(updatedIssue);
      loadIssues();
    } catch (error) {
      console.error("Erro ao assumir a issue:", error);
    }
  };

  const handleAssignIssue = async () => {
    if (!issue) return;
    try {
      const updatedIssue = { ...issue, isAssigned: true, status: true, assignedUserId: user?.id };
      await updateIssue(updatedIssue);
      setIssue(updatedIssue);
      loadIssues();
    } catch (error) {
      console.error("Erro ao assinar a issue:", error);
    }
  };

  const handleDropIssue = async () => {
    if (!issue) return;
    try {
      const updatedIssue = { ...issue, status: false, assignedUserId: null };
      await updateIssue(updatedIssue);
      setIssue(updatedIssue);
      loadIssues();
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

  const isAuthor = issue.authorId === user?.id;
  const isAssignedUser = issue.assignedUserId === user?.id;
  const inProgress = issue.status;
  const isSigned = issue.isAssigned;
  const isSameDepartment = issue.departmentId === user?.departmentId;

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

        {/* Descrição */}
        <p className="text-gray-300 bg-[#2D2F33] p-4 rounded-lg">{issue.description}</p>

        {/* Ações */}
        <div className="flex flex-wrap gap-3 mt-6">
          {/* O botão Editar some após assumir ou assinar a Issue */}
          {isAuthor && !inProgress && !isSigned && (
            <button
              className="bg-blue-500 text-white px-5 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleEditIssue}
              disabled={!issue.id}
            >
              <FaEdit /> Editar Issue
            </button>
          )}

          {/* Qualquer membro do departamento pode assumir a Issue */}
          {!issue.isAssigned && isSameDepartment && !inProgress && (
            <button
              className="bg-green-500 text-white px-5 py-2 rounded-md flex items-center gap-2 hover:bg-green-600 transition"
              onClick={handleAssumeIssue}
            >
              <FaSignInAlt /> Assumir Issue
            </button>
          )}

          {/* O botão "Assinar Issue" só aparece depois que a Issue for assumida */}
          {inProgress && isAssignedUser && !issue.isAssigned && (
            <button
              className="bg-purple-500 text-white px-5 py-2 rounded-md flex items-center gap-2 hover:bg-purple-600 transition"
              onClick={handleAssignIssue}
            >
              <FaCheckCircle /> Assinar Issue
            </button>
          )}

          {/* O botão "Abandonar Issue" só aparece se a Issue ainda não foi assinada */}
          {isAssignedUser && !isSigned && (
            <button
              className="bg-red-500 text-white px-5 py-2 rounded-md flex items-center gap-2 hover:bg-red-600 transition"
              onClick={handleDropIssue}
            >
              <FaUserTimes /> Abandonar Issue
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
