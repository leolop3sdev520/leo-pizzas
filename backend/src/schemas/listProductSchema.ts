import { z } from "zod";

// ============================================================
// SCHEMA: Listar produtos com filtro por `disabled`
// ============================================================
export const listProductsSchema = z.object({
  query: z.object({
    disabled: z
      .enum(["true", "false"], {
        message: "O parâmetro 'disabled' deve ser 'true' ou 'false'.",
      })
      .optional()
      .default("false")
      .transform((value) => value === "true"),
  }),
});
