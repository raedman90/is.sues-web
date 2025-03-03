"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useIssues } from "@/app/contexts/IssuesContext";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { getIssue, updateIssue } from "@/api/issues";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import { issueSchema } from "@/app/schemas/issueSchemaEdit";
import { z } from "zod";

export default function EditIssue() {
  const { user } = useAuth();
  const { id } = useParams();
  const issueId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { loadIssues } = useIssues();

  const [issue, setIssue] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  useEffect(() => {
    async function fetchIssue() {
      if (!id) return;
      try {
        const fetchedIssue = await getIssue(id as string);
        if (fetchedIssue.authorId !== user?.id) {
          router.push(`/dashboard/issues/${id}`);
        } else {
          setIssue({ title: fetchedIssue.title, description: fetchedIssue.description });
        }
      } catch (error) {
        console.error("Erro ao buscar issue:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchIssue();
  }, [id, user, router]);

  const handleSaveIssue = async () => {
    if (!issueId) {
      console.error("ID da issue inválido.");
      return;
    }
  
    const validation = issueSchema.safeParse(issue);
    if (!validation.success) {
      const formattedErrors = validation.error.format();
      setErrors({
        title: formattedErrors.title?._errors[0],
        description: formattedErrors.description?._errors[0],
      });
      return;
    }
  
    try {
      const existingIssue = await getIssue(issueId);
      
      const updatedIssue = {
        ...existingIssue,
        title: issue.title,
        description: issue.description,
      };
  
      await updateIssue(updatedIssue);
      loadIssues();
      router.push(`/dashboard/issues/${issueId}`);
    } catch (error) {
      console.error("Erro ao atualizar issue:", error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen text-white text-lg">
          Carregando dados da issue...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-3xl mx-auto bg-[#1B1D21] text-white rounded-lg shadow-md">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 border-b border-gray-700 pb-4 mb-4">
          <button
            onClick={() => router.push(`/dashboard/issues/${id}`)}
            className="text-gray-400 hover:text-white transition"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Editar Issue</h1>
        </div>

        {/* Formulário de edição */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Título</label>
            <input
              type="text"
              value={issue.title}
              onChange={(e) => setIssue({ ...issue, title: e.target.value })}
              className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
              placeholder="Digite o título da issue"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Descrição</label>
            <textarea
              value={issue.description}
              onChange={(e) => setIssue({ ...issue, description: e.target.value })}
              className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
              placeholder="Descreva a atividade..."
              rows={4}
            />
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Botão de salvar */}
          <button
            onClick={handleSaveIssue}
            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
          >
            <FaSave /> Salvar Alterações
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
