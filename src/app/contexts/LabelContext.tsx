"use client";

import React, { createContext, ReactNode, useState, useEffect } from "react";
import api from "@/api/apiClient";
import { LabelDto } from "@/dtos/LabelDTO";
import Cookies from "js-cookie";
import { useAuth } from "@/app/hooks/useAuth";

interface LabelContextData {
  labels: LabelDto[];
  loadLabels: () => Promise<void>;
  createLabel: (labelData: LabelDto) => Promise<void>;
  updateLabel: (id: number, labelData: LabelDto) => Promise<void>;
  deleteLabel: (id: number) => Promise<void>;
  getLabelById: (id: number) => Promise<LabelDto | null>;
}

export const LabelContext = createContext<LabelContextData | undefined>(undefined);

export const LabelProvider = ({ children }: { children: ReactNode }) => {
  const [labels, setLabels] = useState<LabelDto[]>([]);
  const { user, tokenState } = useAuth();
  // Recupera o token JWT do localStorage
  const getToken = () => {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("Token não encontrado");
    }
    return token;
  };

  // Carregar todos os labels
  const loadLabels = async () => {
    try {
      const token = getToken();
      const response = await api.get("/labels", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLabels(response.data);
    } catch (error) {
      console.error("Erro ao carregar os labels:", error);
    }
  };

  // Criar um novo label
  const createLabel = async (labelData: LabelDto) => {
    try {
      const token = getToken();
      const response = await api.post("/labels", labelData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        await loadLabels(); // Recarrega os labels após criação
      }
    } catch (error) {
      console.error("Erro ao criar a label:", error);
      throw new Error("Erro ao criar a label");
    }
  };

  // Atualizar um label existente por ID
  const updateLabel = async (id: number, labelData: LabelDto) => {
    try {
      const token = getToken();
      const response = await api.put(`/labels/${id}`, labelData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        await loadLabels(); // Recarrega os labels após atualização
      }
    } catch (error) {
      console.error(`Erro ao atualizar o label com ID ${id}:`, error);
      throw new Error("Erro ao atualizar o label");
    }
  };

  // Excluir um label por ID
  const deleteLabel = async (id: number) => {
    try {
      const token = getToken();
      await api.delete(`/labels/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadLabels(); // Recarrega os labels após exclusão
    } catch (error) {
      console.error(`Erro ao excluir o label com ID ${id}:`, error);
      throw new Error("Erro ao excluir o label");
    }
  };

  // Buscar um label por ID
  const getLabelById = async (id: number): Promise<LabelDto | null> => {
    try {
      const token = getToken();
      const response = await api.get(`/labels/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error(`Erro ao buscar o label com ID ${id}:`, error);
      return null;
    }
  };

  // Carregar labels ao iniciar
  useEffect(() => {
    if (tokenState) { // Só carrega se houver um token válido
      loadLabels();
    }
  }, [tokenState]);

  return (
    <LabelContext.Provider value={{ labels, loadLabels, createLabel, updateLabel, deleteLabel, getLabelById }}>
      {children}
    </LabelContext.Provider>
  );
};
