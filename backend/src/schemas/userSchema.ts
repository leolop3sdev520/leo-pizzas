import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "O nome precisa ser um texto" })
      .min(3, { message: "O nome precisa ter no mínimo 3 letras" }),
    email: z.email({ message: "Precisa ser um e-mail válido" }),
    password: z
      .string({ message: "O campo senha é obrigatório!" })
      .min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
  }),
});

export const authUserSchema = z.object({
  body: z.object({
    email: z.email({ message: "Precisa ser um e-mail válido" }),
    password: z
      .string({ message: "A senha é obrigatória" })
      .min(1, { message: "A senha é obrigatória" }),
  }),
});

// ============================================================
// SCHEMA: Finalizar pedido
// ============================================================
export const finishOrderSchema = z.object({
  query: z.object({
    order_id: z
      .string({ message: "O ID do pedido deve ser um texto." })
      .min(1, { message: "O ID do pedido é obrigatório." }),
  }),
});