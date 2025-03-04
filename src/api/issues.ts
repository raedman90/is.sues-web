import { Issue } from "../dtos/IssueDTO";
import api from "./apiClient";
import authenticateUser from "./apiAuth";

// Buscar todas as issues
export const getIssues = async (): Promise<Issue[]> => {
  try {
    const token = authenticateUser();
    if (!token) {
      console.warn("Tentativa de carregar issues sem token. Requisição cancelada.");
      return []; 
    }

    const response = await api.get("/issues", {
      headers: { Authorization: token },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar issues:", error);
    return [];
  }
};


// Buscar uma issue pelo ID
export const getIssue = async (id: string): Promise<Issue> => {
  try {
    const token = authenticateUser();
    if (!token) throw new Error("Token não encontrado");

    const response = await api.get(`/issues/${id}`, {
      headers: { Authorization: token },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar issue:", error);
    throw error;
  }
};

// Atualizar uma issue existente
export const updateIssue = async (updateData: Issue) => {
  try {
    const token = authenticateUser();
    if (!token) throw new Error("Token não encontrado");

    const response = await api.put<Issue>(`/issues/${updateData.id}`, updateData, {
      headers: { Authorization: token },
    });

    console.log("Resposta da API após update:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("❌ Erro ao atualizar a issue:", error.response?.data || error.message);
    throw error;
  }
};

// Buscar nome do autor de uma issue
export const getAuthorIssue = async (authorId: string): Promise<string> => {
  try {
    const response = await api.get(`/users/${authorId}`);
    return response.data.name;
  } catch (error) {
    console.error("Erro ao buscar autor da issue:", error);
    throw error;
  }
};

// Criar uma nova issue
export const createIssues = async (issue: Issue) => {
  try {
    const token = authenticateUser();
    if (!token) throw new Error("Token não encontrado");

    const response = await api.post("/issues/new", issue, {
      headers: { Authorization: token },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao criar issue:", error);
    throw error;
  }
};
