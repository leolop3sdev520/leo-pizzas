import { cookies } from "next/headers";
import { apiClient } from "@/lib/api";
import { User } from "./types";
import { redirect } from "next/navigation";

// Nome do cookie definido em uma constante para evitar erros de digitação
const TOKEN_KEY = "pizzaria.token";

export async function saveToken(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Só envia via HTTPS em produção
    maxAge: 60 * 60 * 24 * 30, // Expira em 30 dias
    path: "/", // Disponível em todas as rotas
    sameSite: "strict",
  });
}

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_KEY)?.value;
}

export async function removeToken() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_KEY);
}

// Função para obter o usuário logado com base no token armazenado
export async function getUser() {
  try {
    const token = await getToken();

    if (!token) {
      return null;
    }

    const user = await apiClient<User>("/me", {
      token: token,
    });
    return user;
  } catch (error) {
    return null;
  }
}

export async function requiredAdmin(): Promise<User> {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (user?.role !== "ADMIN") {
    redirect("/access-denied");
  }

  return user;
}

export async function requiredAuth(): Promise<User> {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

export interface Order {
  id: string;
  table: number;
  name: string | null; // Cliente
  draft: boolean;
  status: boolean;
  createdAt: string;
  user?: { name: string }; // ✅ Adicionado o garçom
  items: OrderItem[];
}
