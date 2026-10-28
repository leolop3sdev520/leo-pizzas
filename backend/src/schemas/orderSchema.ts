// src/schemas/orderSchema.ts
import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    table: z
      .number({ message: "O número da mesa é obrigatório." })
      .int({ message: "O número da mesa deve ser um número inteiro." })
      .positive({ message: "O número da mesa deve ser maior que zero." }),

    name: z
      .string({ message: "O nome do cliente deve ser um texto." })
      .optional(),
  }),
});

// ============================================================
// SCHEMA: Detalhes de um pedido
// ============================================================
export const detailOrderSchema = z.object({
  query: z.object({
    order_id: z
      .string({ message: "O ID do pedido deve ser um texto." })
      .min(1, { message: "O ID do pedido é obrigatório." }),
  }),
});


// ============================================================
// SCHEMA: Enviar pedido para produção
// ============================================================
export const sendOrderSchema = z.object({
  query: z.object({
    order_id: z
      .string({ message: "O ID do pedido deve ser um texto." })
      .min(1, { message: "O ID do pedido é obrigatório." }),
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

// ============================================================
// SCHEMA: Deletar pedido
// ============================================================
export const deleteOrderSchema = z.object({
  query: z.object({
    order_id: z
      .string({ message: "O ID do pedido deve ser um texto." })
      .min(1, { message: "O ID do pedido é obrigatório." }),
  }),
});