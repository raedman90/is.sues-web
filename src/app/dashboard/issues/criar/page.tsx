"use client";

import { useState } from "react";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { useIssues } from "@/app/contexts/IssuesContext";
import { issueSchema } from "@/app/schemas/issueSchema";
import { motion } from "framer-motion";
import { createIssues } from "@/api/issues";
import { Issue } from "@/dtos/IssueDTO";
import { useRouter } from "next/navigation";

export default function CreateIssue() {
  const { user } = useAuth();
  const { loadIssues } = useIssues();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    departmentId: user?.departmentId ?? "",
    authorId: user?.id ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleCreateIssue = async () => {
    setErrors({});
    setLoading(true);

    const validation = issueSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0]] = err.message;
        }
      });
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const issue: Issue = { ...formData };
      await createIssues(issue);
      await loadIssues();
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setErrors({ form: "Erro ao criar a issue. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 text-white flex flex-col gap-6 h-full max-w-2xl mx-auto">
        <div className="flex items-center gap-3 border-b border-gray-700 pb-4 w-full">
          <h1 className="text-2xl font-bold">Criar Nova Issue</h1>
        </div>

        <div className="bg-[#2A2D34] p-6 rounded-lg border border-gray-700 shadow-md w-full">
          {errors.form && <p className="text-red-400 text-sm mb-4">{errors.form}</p>}

          <div>
            <label className="block text-gray-300 mb-2">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
              placeholder="Digite o título da issue"
            />
            {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
          </div>

          <div className="mt-4">
            <label className="block text-gray-300 mb-2">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
              placeholder="Descreva a atividade que deverá ser feita"
            />
            {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
            onClick={handleCreateIssue}
          >
            {loading ? "Criando..." : "Criar Issue"}
          </motion.button>
        </div>
      </div>
    </DashboardLayout>
  );
}
