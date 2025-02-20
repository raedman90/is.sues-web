import { useContext } from "react";
import { DepartmentContext } from "@/app/contexts/DepartmentContext";

export const useDepartment = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error("useDepartment deve ser usado dentro de um DepartmentProvider");
  }
  return context;
};
