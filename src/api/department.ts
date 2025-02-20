import { DepartmentDto } from "../dtos/DepartmentDTO";
import api from "./apiClient";
import authenticateUser from "./apiAuth";

// Buscar nome do departamento
export const getDepartmentName = async (departmentId: string): Promise<string> => {
  try {
    const token = authenticateUser();
    if (!token) throw new Error("Token não encontrado");

    const response = await api.get(`/departments/${departmentId}`, {
      headers: { Authorization: token },
    });

    return response.data.name;
  } catch (error) {
    console.error("Erro ao buscar nome do departamento:", error);
    throw error;
  }
};

// Buscar empresa associada a um departamento
export const getCompanyDepartment = async (departmentId: string): Promise<string> => {
  try {
    const token = authenticateUser();
    if (!token) throw new Error("Token não encontrado");

    const response = await api.get(`/departments/${departmentId}`, {
      headers: { Authorization: token },
    });

    return response.data.companyId;
  } catch (error) {
    console.error("Erro ao buscar empresa do departamento:", error);
    throw error;
  }
};
