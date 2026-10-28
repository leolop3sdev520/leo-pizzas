import { LoginForm } from "@/components/forms/login-form";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

// ✅ A SOLUÇÃO: Remove o 'dynamic' e usa o 'instant = false'
export const instant = false;

export default async function Login() {
  const user = await getUser();

  // O redirecionamento continua aqui e vai funcionar perfeitamente!
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-app-background min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full">
        <LoginForm />
      </div>
    </div>
  );
}
