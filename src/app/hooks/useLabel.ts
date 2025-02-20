import { useContext } from "react";
import { IssuesContext } from "@/app/contexts/IssuesContext";

export const useIssues = () => {
  const context = useContext(IssuesContext);
  if (!context) {
    throw new Error("useIssues deve ser usado dentro de um IssuesProvider");
  }
  return context;
};
