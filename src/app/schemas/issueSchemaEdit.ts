import { z } from "zod";

export const issueSchema = z.object({
  title: z
    .string()
    .min(3, { message: "O título deve ter pelo menos 3 caracteres" }),
  description: z
    .string()
    .min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
});

export type IssueSchema = z.infer<typeof issueSchema>;
