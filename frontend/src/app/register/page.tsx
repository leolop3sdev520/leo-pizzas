export const instant = false; // ✅ AQUI ESTÁ A CORREÇÃO

import { RegisterForm } from "@/components/forms/register-form";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

export default async function Register() {
  const user = await getUser();

  // Se o usuário já estiver logado, redireciona para o dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-app-background min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full">
        <RegisterForm />
      </div>
    </div>
  );
}
