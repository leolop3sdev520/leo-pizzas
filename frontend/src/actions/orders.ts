"use server";

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface ActionResponse {
  success: boolean;
  error: string;
}

export async function createOrderAction(
  formData: FormData,
): Promise<ActionResponse> {
  const token = await getToken();
  const table = Number(formData.get("table"));
  const name = formData.get("name") as string;
  if (!table || table <= 0) return { success: false, error: "Mesa inválida." };

  try {
    await apiClient("/order", {
      method: "POST",
      body: JSON.stringify({ table, name: name || undefined }),
      token: token!,
    });
    return { success: true, error: "" };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao abrir a mesa." };
  }
}

export async function addItemAction(
  formData: FormData,
): Promise<ActionResponse> {
  const token = await getToken();
  const order_id = formData.get("order_id") as string;
  const product_id = formData.get("product_id") as string;
  const amount = Number(formData.get("amount"));
  if (!order_id || !product_id || amount <= 0)
    return { success: false, error: "Dados inválidos." };

  try {
    await apiClient("/order/add", {
      method: "POST",
      body: JSON.stringify({ order_id, product_id, amount }),
      token: token!,
    });
    return { success: true, error: "" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Erro ao adicionar item.",
    };
  }
}

export async function removeItemAction(
  itemId: string,
): Promise<ActionResponse> {
  const token = await getToken();
  try {
    await apiClient(`/order/remove?item_id=${itemId}`, {
      method: "DELETE",
      token: token!,
    });
    return { success: true, error: "" };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao remover item." };
  }
}

export async function sendOrderAction(
  orderId: string,
): Promise<ActionResponse> {
  const token = await getToken();
  try {
    await apiClient(`/order/send?order_id=${orderId}`, {
      method: "PUT",
      token: token!,
    });
    return { success: true, error: "" };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao enviar pedido." };
  }
}

export async function finishItemAction(
  itemId: string,
): Promise<ActionResponse> {
  const token = await getToken();
  try {
    await apiClient(`/item/finish?item_id=${itemId}`, {
      method: "PUT",
      token: token!,
    });
    return { success: true, error: "" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Erro ao finalizar item.",
    };
  }
}

export async function finishTableAction(
  orderId: string,
): Promise<ActionResponse> {
  const token = await getToken();
  try {
    await apiClient(`/order?order_id=${orderId}`, {
      method: "DELETE",
      token: token!,
    });
    return { success: true, error: "" };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao fechar a mesa." };
  }
}
