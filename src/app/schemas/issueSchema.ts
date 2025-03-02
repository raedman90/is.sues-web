import { z } from "zod";

export const issueSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres"),
  departmentId: z.string().nonempty("Departamento inválido"),
  authorId: z.string().nonempty("Usuário inválido"),
});

export type IssueSchema = z.infer<typeof issueSchema>;
