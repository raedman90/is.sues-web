import { z } from "zod";

export const labelSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres"),
  departmentId: z.string().min(1, "Selecione um departamento válido"),
});

export type LabelSchema = z.infer<typeof labelSchema>;
