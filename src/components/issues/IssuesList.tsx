import React from "react";
import { Issue } from "@/dtos/IssueDTO";
import IssueItem from "./IssueItem";

interface IssuesListProps {
  issues: Issue[];
}

const IssuesList: React.FC<IssuesListProps> = ({ issues }) => {
  if (issues.length === 0) {
    return <p className="text-gray-400 text-center mt-4">Nenhuma issue encontrada.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {issues.map((issue) => (
        <IssueItem key={issue.id} item={issue} />
      ))}
    </div>
  );
};

export default IssuesList;
