"use client";

import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { getIssues, updateIssue, createIssues, getAuthorIssue } from "@/api/issues";
import { Issue } from "@/dtos/IssueDTO";
import { useAuth } from "@/app/hooks/useAuth";
import { getMyIssues } from "@/api/apiUser";
import { getAllDepartments } from "@/api/department";
import Cookies from "js-cookie";

type IssuesContextData = {
  issues: Issue[];
  myIssues: Issue[];
  loadIssues: () => Promise<void>;
  loadMyIssues: () => Promise<void>;
  createNewIssue: (issueData: Partial<Issue>) => Promise<void>;
  updateExistingIssue: (issueData: Issue) => Promise<void>;
  getAuthorName: (authorId: string) => Promise<string>;
};

export const IssuesContext = createContext<IssuesContextData | undefined>(undefined);

type IssuesProviderProps = {
  children: ReactNode;
};

export const IssuesProvider: React.FC<IssuesProviderProps> = ({ children }) => {
  const { user, tokenState } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [myIssues, setMyIssues] = useState<Issue[]>([]);

  // Carrega todas as issues
  const loadIssues = async () => {
    if (!user?.departmentId) return;
  
    try {
      // 🔹 Obtém todos os departamentos disponíveis
      const departments = await getAllDepartments();
      const userDepartment = departments.find((dept) => dept.id === user.departmentId);
      if (!userDepartment) return;
  
      // 🔹 Filtra os departamentos que pertencem à empresa do usuário
      const companyDepartments = departments.filter((dept) => dept.companyId === userDepartment.companyId);
      const departmentIds = companyDepartments.map((dept) => dept.id);
  
      // 🔹 Busca todas as issues e filtra para pegar somente as da empresa
      const allIssues = await getIssues();
      const filteredIssues = allIssues.filter((issue) => issue.departmentId && departmentIds.includes(issue.departmentId));
  
      setIssues(filteredIssues);
    } catch (error) {
      console.error("Erro ao carregar issues:", error);
    }
  };

  // Carrega as issues do usuário logado
  const loadMyIssues = async () => {
    try {
      if (user?.id) {
        const myIssuesResponse = await getMyIssues(user.id);
        setMyIssues(Array.isArray(myIssuesResponse) ? myIssuesResponse : []);
      }
    } catch (error) {
      console.error("Erro ao carregar minhas issues:", error);
    }
  };

  // Cria uma nova issue
  const createNewIssue = async (issueData: Partial<Issue>) => {
    try {
      // É importante garantir que issueData contenha os campos necessários.
      await createIssues(issueData as Issue);
      await loadIssues();
    } catch (error) {
      console.error("Erro ao criar issue:", error);
    }
  };

  // Atualiza uma issue existente
  const updateExistingIssue = async (issueData: Issue) => {
    try {
      await updateIssue(issueData);
      await loadIssues();
    } catch (error) {
      console.error("Erro ao atualizar a issue:", error);
    }
  };

  // Obtém o nome do autor de uma issue
  const getAuthorName = async (authorId: string) => {
    try {
      return await getAuthorIssue(authorId);
    } catch (error) {
      console.error("Erro ao buscar o autor da issue:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (tokenState) {
      loadIssues();
    }
  }, [tokenState]);

  useEffect(() => {
    if (user?.id) {
      loadMyIssues();
    }
  }, [user]);

  return (
    <IssuesContext.Provider
      value={{
        issues,
        myIssues,
        loadIssues,
        loadMyIssues,
        createNewIssue,
        updateExistingIssue,
        getAuthorName,
      }}
    >
      {children}
    </IssuesContext.Provider>
  );
};

export const useIssues = () => {
  const context = useContext(IssuesContext);
  if (!context) {
    throw new Error("useIssues deve ser usado dentro de um IssuesProvider");
  }
  return context;
};
