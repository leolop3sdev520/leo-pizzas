import { cookies } from "next/headers";
import { apiClient } from "@/lib/api";
import { User } from "./types";
import { redirect } from "next/navigation";

const TOKEN_KEY = "pizzaria.token";

export async function saveToken(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
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

  if (!user) {
    redirect("/login");
  }

  return user;
}
