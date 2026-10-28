import { z } from "zod";

export const updateProductSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "O nome é obrigatório." })
      .min(1, "O nome não pode ser vazio."),
    price: z.string({ message: "O preço é obrigatório." }),
    description: z
      .string({ message: "A descrição é obrigatória." })
      .min(1, "A descrição não pode ser vazia."),
    category_id: z.string({ message: "A categoria é obrigatória." }),
    disabled: z.string().optional(),
  }),
});
