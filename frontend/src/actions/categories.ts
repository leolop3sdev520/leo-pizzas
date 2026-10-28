"use server";

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";
// importe os tipos se necessário (ex: Category)

interface ActionResponse {
  success: boolean;
  error: string;
}

export async function createCategoryAction(
  formData: FormData,
): Promise<ActionResponse> {
  // <-- Agora prometemos retornar o ActionResponse
  const name = formData.get("name") as string;
  const token = await getToken();

  if (!name) {
    return { success: false, error: "O nome da categoria é obrigatório." };
  }

  try {
    await apiClient("/category", {
      method: "POST",
      body: JSON.stringify({ name }),
      token: token!,
    });

    revalidatePath("/dashboard/categories");

    // ✅ Se deu certo, retorna sucesso
    return { success: true, error: "" };
  } catch (error: any) {
    // ❌ Se o backend recusou, retorna a mensagem de erro
    return {
      success: false,
      error: error.message || "Erro ao criar categoria.",
    };
  }
}

export async function deleteCategoryAction(
  categoryId: string,
): Promise<ActionResponse> {
  const token = await getToken();

  try {
    // Passamos o ID como query param: /category?id=...
    await apiClient(`/category?id=${categoryId}`, {
      method: "DELETE",
      token: token!,
    });

    return { success: true, error: "" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Erro ao excluir a categoria.",
    };
  }
}
