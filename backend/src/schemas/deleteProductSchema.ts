import { z } from "zod";

export const deleteProductSchema = z.object({
  query: z.object({
    product_id: z
      .string({ message: "O ID do produto é obrigatório." })
      .min(1, { message: "O ID do produto é obrigatório." }),
  }),
});
