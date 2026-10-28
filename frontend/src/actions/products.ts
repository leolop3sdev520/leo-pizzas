"use server";

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface ActionResponse {
  success: boolean;
  error: string;
}

export async function createProductAction(
  formData: FormData,
): Promise<ActionResponse> {
  const token = await getToken();

  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const category_id = formData.get("category_id") as string;
  const file = formData.get("file") as File;

  // Validações básicas no servidor
  if (
    !name ||
    !price ||
    !description ||
    !category_id ||
    !file ||
    file.size === 0
  ) {
    return {
      success: false,
      error: "Preencha todos os campos e envie uma imagem.",
    };
  }

  try {
    // O nosso apiClient já foi configurado para não colocar Content-Type: application/json
    await apiClient("/product", {
      method: "POST",
      body: formData,
      token: token!,
    });

    return { success: true, error: "" };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar produto." };
  }
}

export async function deleteProductAction(
  productId: string,
): Promise<ActionResponse> {
  const token = await getToken();

  try {
    // O backend espera o product_id via query param
    await apiClient(`/product?product_id=${productId}`, {
      method: "DELETE",
      token: token!,
    });

    return { success: true, error: "" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Erro ao excluir o produto.",
    };
  }
}
export async function updateProductAction(
  formData: FormData,
  productId: string,
): Promise<ActionResponse> {
  const token = await getToken();

  // ✅ A MÁGICA ACONTECE AQUI:
  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    formData.delete("file"); // Remove o arquivo vazio para o Multer não reclamar
  }

  try {
    await apiClient(`/product?id=${productId}`, {
      method: "PUT",
      body: formData,
      token: token!,
    });

    return { success: true, error: "" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Erro ao atualizar produto.",
    };
  }
}
