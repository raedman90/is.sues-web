import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  occupation: z.string().min(2, "O cargo deve ter pelo menos 2 caracteres"),
  departmentId: z.string().min(1, "Selecione um departamento"),
});

export type EmployeeSchema = z.infer<typeof employeeSchema>;
