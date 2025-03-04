"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Issue } from "@/dtos/IssueDTO";
import { FaExclamationCircle, FaCheckCircle, FaHourglassHalf, FaBuilding } from "react-icons/fa";
import { useAuth } from "@/app/hooks/useAuth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getAuthorIssue } from "@/api/issues";
import { getDepartmentName } from "@/api/department";

interface IssueItemProps {
  item: Issue;
}

const IssueItem: React.FC<IssueItemProps> = ({ item }) => {
  const [authorName, setAuthorName] = useState<string>("Carregando...");
  const [departmentName, setDepartmentName] = useState<string>("Carregando...");
  const { user } = useAuth();

  // Define a cor e o ícone com base no status da Issue
  const getStatus = () => {
    if (item.isAssigned) return { label: "Concluída", color: "bg-blue-500", icon: <FaCheckCircle /> };
    if (item.status) return { label: "Em progresso", color: "bg-yellow-500", icon: <FaHourglassHalf /> };
    return { label: "Aberta", color: "bg-green-500", icon: <FaExclamationCircle /> };
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Data inválida";
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const { label, color, icon } = getStatus();

  useEffect(() => {
    async function fetchIssueDetails() {
      try {
        if (item.authorId) {
          const author = await getAuthorIssue(item.authorId);
          setAuthorName(author);
        }

        if (item.departmentId) {
          const department = await getDepartmentName(item.departmentId);
          setDepartmentName(department);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes da issue:", error);
        setAuthorName("Desconhecido");
        setDepartmentName("Não definido");
      }
    }

    fetchIssueDetails();
  }, [item.authorId, item.departmentId]);

  return (
    <Link href={`/dashboard/issues/${item.id}`} className="block bg-[#6C717B] p-4 rounded-lg shadow-md hover:bg-[#555b63] transition">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-300">Aberta em {formatDate(item.createdAt)}</span>
        <span className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-md text-white ${color}`}>
          {icon} {label}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
      <p className="text-gray-300 text-sm">{item.description}</p>

      {/* Exibição do nome do departamento designado */}
      <div className="mt-3 flex justify-between text-sm text-gray-400">
        <span>Por {authorName}</span>
        <span className="flex items-center gap-2">
          <FaBuilding className="text-gray-400" /> {departmentName}
        </span>
      </div>
    </Link>
  );
};

export default IssueItem;
