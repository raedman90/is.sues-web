"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/apiClient";
import { UsersDto } from "@/dtos/UserDTO";

interface AuthContextData {
  tokenState: string | null;
  user: UsersDto | null;
  isAuthenticated: boolean;
  companyId: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, occupation: string, email: string, password: string, adm: boolean, departmentId: string | null) => Promise<void>;
  signOut: () => void;
  updateUser: (id: string, name: string, occupation: string, email: string, departmentId: string) => Promise<void>;
  getEmployeeById: (id: string) => Promise<UsersDto | null>;
  deleteEmployee: (id: string) => Promise<void>;
  updateProfilePicture: (id: string, image: File) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokenState, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<UsersDto | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadStoredUser() {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      const storedCompanyId = localStorage.getItem("companyId");

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        setTokenState(token);
        setCompanyId(storedCompanyId);
      }
      setLoading(false);
    }
    loadStoredUser();
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post("/signin", { email, password });
      const { token, userAttempAuth } = response.data;
      const userData: UsersDto = userAttempAuth;

      let companyId = null;
      try {
        const companyResponse = await api.get(`/company/head/${userData.id}`);
        companyId = companyResponse.data?.id || null;
      } catch {}

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      if (companyId) localStorage.setItem("companyId", companyId);

      setTokenState(token);
      setUser(userData);
      setCompanyId(companyId);

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      throw new Error("Erro ao fazer login. Verifique suas credenciais.");
    }
  }

  async function signUp(name: string, occupation: string, email: string, password: string, adm: boolean, departmentId: string | null) {
    try {
      await api.post("/users", { name, occupation, email, password, adm, departmentId });
    } catch (error) {
      console.error("Erro ao se registrar:", error);
      throw new Error("Erro ao fazer registro. Tente novamente.");
    }
  }

  async function updateProfilePicture(id: string, image: File) {
    try {
      const formData = new FormData();
      formData.append("profilePicture", image);

      const response = await api.post(`/users/${id}/profile-picture`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        const updatedUser = response.data.user as UsersDto;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Erro ao atualizar a foto de perfil:", error);
    }
  }

  async function updateUser(id: string, name: string, occupation: string, email: string, departmentId: string) {
    try {
      await api.put(`/users/${id}`, { name, occupation, email, departmentId });
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error);
      throw new Error("Erro ao atualizar o funcionário.");
    }
  }

  async function getEmployeeById(id: string): Promise<UsersDto | null> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.status === 200 ? response.data : null;
    } catch (error) {
      console.error(`Erro ao buscar funcionário ${id}:`, error);
      return null;
    }
  }

  async function deleteEmployee(id: string) {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar funcionário ${id}:`, error);
      throw new Error("Erro ao deletar funcionário.");
    }
  }

  function signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("companyId");
    setTokenState(null);
    setUser(null);
    setCompanyId(null);
    router.push("/");
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, tokenState, companyId, signIn, signUp, signOut, updateUser, getEmployeeById, deleteEmployee, updateProfilePicture }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
