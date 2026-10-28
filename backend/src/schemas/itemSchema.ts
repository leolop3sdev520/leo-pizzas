import { z } from "zod";

export const addItemSchema = z.object({
  body: z.object({
    order_id: z
      .string({ message: "O ID do pedido deve ser um texto." })
      .min(1, { message: "O ID do pedido é obrigatório." }),

    product_id: z
      .string({ message: "O ID do produto deve ser um texto." })
      .min(1, { message: "O ID do produto é obrigatório." }),

    amount: z
      .number({ message: "A quantidade é obrigatória." })
      .int({ message: "A quantidade deve ser um número inteiro." })
      .positive({ message: "A quantidade deve ser maior que zero." }),
  }),
});


// ============================================================
// SCHEMA: Remover item do pedido
// ============================================================
export const removeItemSchema = z.object({
  query: z.object({
    item_id: z
      .string({ message: "O ID do item deve ser um texto." })
      .min(1, { message: "O ID do item é obrigatório." }),
  }),
});