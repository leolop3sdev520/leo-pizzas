const API_URL =
  (process.env.NEXT_PUBLIC_API_URL as string) || "http://localhost:3333";

export function getApiUrl() {
  return API_URL;
}

interface FetchOptions extends RequestInit {
  token?: string;
  cache?: "no-store" | "force-cache";
  next?: {
    revalidate?: false | 0 | number;
    tags?: string[];
  };
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    // Tenta pegar a mensagem de erro exata que o seu backend Express envia
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Erro na requisição");
  }

  // Se o backend retornar 204 (No Content), significa que não há corpo de resposta
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
