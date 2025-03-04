"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import api from "@/api/apiClient";
import { CommentDto } from "@/dtos/CommentDTO";

interface CommentsContextData {
  comments: CommentDto[];
  loadComments: (issueId: string) => Promise<void>;
  addComment: (issueId: string, authorId: string, content: string) => Promise<void>;
}

export const CommentsContext = createContext<CommentsContextData>({} as CommentsContextData);

export const CommentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [comments, setComments] = useState<CommentDto[]>([]);

  // Função para carregar comentários de uma issue específica
  const loadComments = async (issueId: string) => {
    try {
      const response = await api.get(`/comments/${issueId}`);
      setComments(response.data);
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    }
  };

  // Função para adicionar um novo comentário
  const addComment = async (issueId: string, authorId: string, content: string) => {
    try {
      const response = await api.post(`/comments/${issueId}`, { authorId, content });
      setComments((prevComments) => [...prevComments, response.data]);
      console.log("Comentário adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  };

  return (
    <CommentsContext.Provider value={{ comments, loadComments, addComment }}>
      {children}
    </CommentsContext.Provider>
  );
};
