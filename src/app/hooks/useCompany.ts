import { useContext } from "react";
import { CompanyContext } from "@/app/contexts/CompanyContext";

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany deve ser usado dentro de um CompanyProvider");
  }
  return context;
};
