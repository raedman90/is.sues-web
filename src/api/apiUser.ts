import { UsersDto } from "../dtos/UserDTO";
import { Issue } from "../dtos/IssueDTO";
import api from "./apiClient";
import authenticateUser from "./apiAuth";

// Verifica se o usuário é administrador
export const verifyAdmin = async (): Promise<boolean> => {
  try {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user: UsersDto = JSON.parse(userString);
      return user.adm; // Assume que `adm` é um booleano indicando se o usuário é admin
    }
    return false;
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    throw error;
  }
};

// Atribui uma issue a um usuário
export const assumeIssue = async (user: UsersDto, issue: Issue) => {
  try {
    const token = authenticateUser();
    if (!token) throw new Error("Token não encontrado");

    const updatedIssues = user.issues ? [...user.issues, issue] : [issue];

    // Atualizar o usuário com a lista de issues modificada
    const response = await api.put<UsersDto>(
      `/users/${user.id}`,
      { ...user, issues: updatedIssues },
      { headers: { Authorization: token } }
    );

    console.log("Issue assumida com sucesso:", response.data);
  } catch (error) {
    console.error("Erro ao atualizar a issue:", error);
  }
};

// Obtém as issues atribuídas ao usuário
export const getMyIssues = async (userId: string): Promise<Issue[]> => {
  try {
    const token = authenticateUser();
    if (!token) throw new Error("Token não encontrado");

    const response = await api.get<Issue[]>(`/users/${userId}/assigned-issues`, {
      headers: { Authorization: token },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao obter minhas issues:", error);
    return [];
  }
};
