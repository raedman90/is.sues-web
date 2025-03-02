import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(3, "O nome da empresa deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  description: z.string().optional(),
  latitude: z.number().min(-90, "Latitude inválida").max(90, "Latitude inválida"),
  longitude: z.number().min(-180, "Longitude inválida").max(180, "Longitude inválida"),
  headid: z.string().nullable(),
});

export type RegisterCompanySchema = z.infer<typeof companySchema>;
