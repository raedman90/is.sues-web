import React, { createContext, useState, ReactNode, useEffect } from "react";
import api from "@/api/apiClient";
import { DepartmentDto } from "@/dtos/DepartmentDTO";

interface DepartmentContextData {
  departments: DepartmentDto[];
  createDepartment: (departmentData: DepartmentDto) => Promise<void>;
  loadDepartments: () => Promise<void>;
  getDepartmentById: (id: string) => Promise<DepartmentDto | undefined>;
  updateDepartment: (id: string, updatedData: Partial<DepartmentDto>) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  getUsersFromDepartment: (id: string) => Promise<void>;
}

export const DepartmentContext = createContext<DepartmentContextData>({} as DepartmentContextData);

export const DepartmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);

  // Carregar departamentos ao iniciar
  useEffect(() => {
    loadDepartments();
  }, []);

  // Função para carregar todos os departamentos
  const loadDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const response = await api.get("/departments/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error("Erro ao carregar departamentos:", error);
    }
  };

  // Criar um novo departamento
  const createDepartment = async (departmentData: DepartmentDto) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const response = await api.post("/departments/new", departmentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments((prevDepartments) => [...prevDepartments, response.data]);

      console.log("Departamento criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar departamento:", error);
    }
  };

  // Buscar um departamento pelo ID
  const getDepartmentById = async (id: string): Promise<DepartmentDto | undefined> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const response = await api.get(`/departments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar o departamento de ID ${id}:`, error);
      return undefined;
    }
  };

  // Atualizar um departamento
  const updateDepartment = async (id: string, updatedData: Partial<DepartmentDto>) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      await api.put(`/departments/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await loadDepartments(); // Recarregar a lista de departamentos
      console.log("Departamento atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o departamento:", error);
    }
  };

  // Deletar um departamento
  const deleteDepartment = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      await api.delete(`/departments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDepartments((prevDepartments) => prevDepartments.filter((dept) => dept.id !== id));
      console.log("Departamento deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar o departamento:", error);
    }
  };

  // Buscar usuários dentro de um departamento
  const getUsersFromDepartment = async (departmentId: string) => {
    try {
      const response = await api.get(`/departments/${departmentId}/users`);
      return response.data.users;
    } catch (error) {
      console.error("Erro ao buscar os usuários do departamento:", error);
      throw error;
    }
  };

  return (
    <DepartmentContext.Provider
      value={{
        departments,
        createDepartment,
        loadDepartments,
        getDepartmentById,
        updateDepartment,
        deleteDepartment,
        getUsersFromDepartment,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};
