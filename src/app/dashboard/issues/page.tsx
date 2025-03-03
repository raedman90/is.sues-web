"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useIssues } from "@/app/contexts/IssuesContext";
import { useAuth } from "@/app/hooks/useAuth";
import IssuesList from "@/components/issues/IssuesList";
import { Issue } from "@/dtos/IssueDTO";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type SectionState = {
  openIssues: boolean;
  issuesMadeForMe: boolean;
  myIssuesAssigned: boolean;
};

export default function MyIssuesScreen() {
  const { user } = useAuth();
  const { myIssues, loadMyIssues, issues, loadIssues } = useIssues();

  useEffect(() => {
    if (user) {
      loadMyIssues();
    }
  }, [user]);

  useEffect(() => {
    if (issues.length > 0) {
      loadMyIssues();
    }
  }, [issues]);

  const myOpenIssues = myIssues.filter((issue) => issue.isAssigned === false);
  const issuesMadeForMe = issues.filter((issue) => issue.authorId === user?.id);
  const myIssuesAssigned = issues.filter(
    (issue) => issue.assignedUserId === user?.id && issue.isAssigned === true
  );

  const [isOpen, setIsOpen] = useState<SectionState>({
    openIssues: true,
    issuesMadeForMe: false,
    myIssuesAssigned: false,
  });

  const toggleSection = (section: keyof SectionState) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <DashboardLayout>
      <div className="p-6 text-white flex flex-col gap-6 h-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center border-b border-gray-700 pb-4">Minhas Issues</h1>

        {/* Seção de Issues para concluir */}
        <SectionIssues
          title="Issues para concluir"
          issues={myOpenIssues}
          isOpen={isOpen.openIssues}
          toggleSection={() => toggleSection("openIssues")}
        />

        {/* Seção de Issues criadas pelo usuário */}
        <SectionIssues
          title="Issues criadas por mim"
          issues={issuesMadeForMe}
          isOpen={isOpen.issuesMadeForMe}
          toggleSection={() => toggleSection("issuesMadeForMe")}
        />

        {/* Seção de Issues assinadas */}
        <SectionIssues
          title="Issues assinadas"
          issues={myIssuesAssigned}
          isOpen={isOpen.myIssuesAssigned}
          toggleSection={() => toggleSection("myIssuesAssigned")}
        />
      </div>
    </DashboardLayout>
  );
}

interface SectionIssuesProps {
  title: string;
  issues: Issue[];
  isOpen: boolean;
  toggleSection: () => void;
}

const SectionIssues: React.FC<SectionIssuesProps> = ({ title, issues, isOpen, toggleSection }) => {
  return (
    <div className="bg-[#2A2D34] rounded-lg border border-gray-700 p-4 shadow-md">
      <button
        className="w-full flex justify-between items-center text-lg font-semibold text-gray-300 hover:text-white transition"
        onClick={toggleSection}
      >
        {title}
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          {issues.length > 0 ? (
            <IssuesList issues={issues} />
          ) : (
            <p className="text-gray-400 text-center">Nenhuma issue encontrada.</p>
          )}
        </motion.div>
      )}
    </div>
  );
};
