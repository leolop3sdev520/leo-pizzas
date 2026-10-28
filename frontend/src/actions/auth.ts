"use server";

import { AuthResponse, User } from "@/lib/types";
import { saveToken, removeToken } from "@/lib/auth";
import { apiClient } from "@/lib/api";
import { redirect } from "next/navigation"; // CORREÇÃO 1: Import correto

// CORREÇÃO 3: Adicionando o redirectTo como opcional
interface ActionResponse {
  success: boolean;
  error: string;
  redirectTo?: string;
}

// INÍCIO REGISTER
export async function registerAction(
  prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { success: false, error: "Preencha todos os campos obrigatórios." };
  }

  try {
    await apiClient<User>("/users", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    return { success: true, error: "" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Erro ao registrar usuário.",
    };
  }
}
// FIM REGISTER

// INÍCIO LOGIN
export async function loginAction(
  prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  // Adicionado Promise<ActionResponse>
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Preencha todos os campos." };
  }

  try {
    const response = await apiClient<AuthResponse>("/session", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // CORREÇÃO 2: Salvar o token antes de retornar sucesso!
    await saveToken(response.token);

    return { success: true, error: "", redirectTo: "/dashboard" };
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || "Erro ao fazer o login",
      };
    }

    return { success: false, error: "Erro ao fazer o login" };
  }
}
// FIM LOGIN

// LOGOUT
export async function logoutAction() {
  await removeToken();
  redirect("/login");
}
// FIM LOGOUT
