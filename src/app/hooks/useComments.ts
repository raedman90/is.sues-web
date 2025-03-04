import { useContext } from "react";
import { CommentsContext } from "@/app/contexts/CommentsContext";

export const useComments = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error("useComments deve ser usado dentro de um CommentsProvider");
  }
  return context;
};
