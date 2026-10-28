import { z } from "zod";

const listProductByCategorySchema = z.object({
  query: z.object({
    category_id: z.string({ message: "O ID da categoria é obrigatório" }),
  }),
});

export { listProductByCategorySchema };
