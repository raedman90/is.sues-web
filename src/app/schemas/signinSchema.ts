import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type SigninSchema = z.infer<typeof signinSchema>;
