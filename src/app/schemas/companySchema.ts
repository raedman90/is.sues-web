import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  description: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
});

export type CompanySchema = z.infer<typeof companySchema>;
