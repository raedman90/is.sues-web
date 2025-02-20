"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import api from "@/api/apiClient";
import { CompanyDto } from "@/dtos/CompanyDTO";

interface CompanyContextData {
  companies: CompanyDto[];
  createCompany: (companyData: CompanyDto) => Promise<void>;
  loadCompanies: () => Promise<void>;
  updateCompany: (companyId: string, updatedData: Partial<CompanyDto>) => Promise<void>;
}

export const CompanyContext = createContext<CompanyContextData>({} as CompanyContextData);

export const CompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<CompanyDto[]>([]);

  // Carrega empresas automaticamente ao iniciar
  useEffect(() => {
    loadCompanies();
  }, []);

  // Função para carregar empresas da API
  const loadCompanies = async () => {
    try {
      const response = await api.get("/company/all");
      setCompanies(response.data);
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
    }
  };

  // Função para criar uma nova empresa
  const createCompany = async (companyData: CompanyDto) => {
    try {
      const response = await api.post("/company/new", companyData);
      setCompanies((prevCompanies) => [...prevCompanies, response.data]); // Adiciona a nova empresa ao estado
      console.log("Empresa criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar empresa:", error);
    }
  };

  // Função para atualizar uma empresa
  const updateCompany = async (companyId: string, updatedData: Partial<CompanyDto>) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const response = await api.put(`/company/${companyId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Atualiza a lista de empresas
      setCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company.id === companyId ? { ...company, ...response.data } : company
        )
      );

      console.log("Empresa atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error);
    }
  };

  return (
    <CompanyContext.Provider value={{ companies, createCompany, loadCompanies, updateCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};
