import { CompanyDto } from "../dtos/CompanyDTO";
import api from "./apiClient";
import authenticateUser from "./apiAuth";

// Buscar empresa a partir do ID do departamento
export const getCompanyByDep = async (departmentId: string): Promise<CompanyDto> => {
  try {
    const token = authenticateUser();
    if (!token) throw new Error("Token não encontrado");

    // Buscar departamento para obter o companyId
    const departmentResponse = await api.get(`/departments/${departmentId}`, {
      headers: { Authorization: token },
    });

    if (!departmentResponse.data.companyId) {
      throw new Error("Departamento não está vinculado a nenhuma empresa.");
    }

    // Buscar empresa pelo companyId do departamento
    const response = await api.get(`/company/${departmentResponse.data.companyId}`, {
      headers: { Authorization: token },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar empresa pelo departamento:", error);
    throw error;
  }
};

// Buscar empresa pelo ID
export const getCompany = async (companyId: string): Promise<CompanyDto> => {
  try {
    const token = authenticateUser();
    if (!token) throw new Error("Token não encontrado");

    const response = await api.get(`/company/${companyId}`, {
      headers: { Authorization: token },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);
    throw error;
  }
};
