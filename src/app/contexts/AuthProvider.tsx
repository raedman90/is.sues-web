"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/apiClient";
import Cookies from "js-cookie";
import { UsersDto } from "@/dtos/UserDTO";

interface AuthContextData {
    tokenState: string | null;
    user: UsersDto | null;
    isAuthenticated: boolean;
    companyId: string | null;
    signIn: (email: string, password: string) => Promise<{ userData: UsersDto; companyId: string | null }>;
    signUp: (name: string, occupation: string, email: string, password: string, adm: boolean, departmentId: string | null) => Promise<UsersDto>;
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

      const token = Cookies.get("token");
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


  async function signIn(email: string, password: string): Promise<{ userData: UsersDto; companyId: string | null }> {
    try {
        const response = await api.post("/signin", { email, password });

        if (!response.data?.token || !response.data?.userAttempAuth) {
            throw new Error("Resposta inválida da API. Nenhum token recebido.");
        }

        const { token, userAttempAuth } = response.data;
        const userData: UsersDto = userAttempAuth;

        let companyId: string | null = null;

        // Somente buscar empresa se o usuário for administrador (head)
        if (userData.adm) {
            try {
                const companyResponse = await api.get(`/company/head/${userData.id}`);
                if (companyResponse.status === 200) {
                    companyId = companyResponse.data?.id || null;
                }
            } catch (error: any) {
                if (error.response && error.response.status === 404) {
                    console.log("Nenhuma empresa encontrada para este usuário.");
                } else {
                    console.error("Erro ao buscar empresa:", error);
                }
            }
        }

        // Salvar o token em um Cookie (Expira em 7 dias)
        Cookies.set("token", token, { expires: 7 });

        // Salvar o usuário no LocalStorage para uso no Frontend
        localStorage.setItem("user", JSON.stringify(userData));
        if (companyId) localStorage.setItem("companyId", companyId);
        else localStorage.removeItem("companyId");

        setTokenState(token);
        setUser(userData);
        setCompanyId(companyId);

        console.log("Login bem-sucedido:", userData);

        return { userData, companyId };
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw new Error("Erro ao fazer login. Verifique suas credenciais.");
    }
}


  

  async function signUp(
    name: string,
    occupation: string,
    email: string,
    password: string,
    isAdmin: boolean,
    departmentId?: string | null
  ): Promise<UsersDto> {
    try {
      const userData: Record<string, any> = {
        name,
        occupation,
        email,
        password,
        adm: isAdmin,
      };
  
      if (departmentId) {
        userData.departmentId = departmentId;
      }
  
      const response = await api.post("/users", userData);
  
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Erro ao se registrar. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao fazer registro:", error);
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
    Cookies.remove("token");
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
function setDepartments(arg0: never[]) {
  throw new Error("Function not implemented.");
}

function setIssues(arg0: never[]) {
  throw new Error("Function not implemented.");
}

