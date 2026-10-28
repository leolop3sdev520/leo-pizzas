import cors from "cors";
import "dotenv";
import { Request, Response, NextFunction } from "express";
import express from "express";
import { router } from "./routes.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://leo-pizzas.vercel.app"],
    credentials: true,
  }),
);
app.use(router);

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof Error) {
    return res.status(400).json({
      error: error.message,
    });
  }
  return res.status(500).json({
    error: "Internal Server Error",
  });
});

const PORT = Number(process.env.PORT) || 3333;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
