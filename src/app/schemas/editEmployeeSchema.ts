import { z } from "zod";

export const editEmployeeSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um e-mail válido"),
  occupation: z.string().min(2, "O cargo deve ter pelo menos 2 caracteres"),
  departmentId: z.string().min(1, "Selecione um departamento válido"),
});

export type EditEmployeeSchema = z.infer<typeof editEmployeeSchema>;
