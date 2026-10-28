import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";

interface ParsedSchema {
  body?: unknown;
  query?: unknown;
  params?: unknown;
}

export function validateSchema(schema: ZodType) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Guardamos o resultado do parse, porque o Zod devolve os valores
      // JÁ TRANSFORMADOS (ex: "true" → true).
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as ParsedSchema;

      // Reatribui os valores validados/transformados de volta ao req.
      // Sem isso, schemas com .transform() ou .default() não surtem efeito.
      if (parsed.body) {
        req.body = parsed.body;
      }

      // ⚠️ Express 5: `req.query` e `req.params` viraram getters sem setter.
      // Por isso usamos Object.defineProperty para sobrescrever de forma segura.
      if (parsed.query) {
        Object.defineProperty(req, "query", {
          value: parsed.query,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }

      if (parsed.params) {
        Object.defineProperty(req, "params", {
          value: parsed.params,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Erro de Validação",
          details: error.issues.map((issue) => ({
            message: issue.message,
            path: issue.path,
          })),
        });
      }

      // Log para você ver o erro real se algo mais der problema
      console.log("Erro inesperado no validateSchema:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  };
}
