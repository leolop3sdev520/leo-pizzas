import { RegisterForm } from "@/components/forms/register-form";
import { redirect } from "next/dist/client/components/navigation";
import { getUser } from "@/lib/auth";

export default async function Register() {
  const user = await getUser();

  if (user) {
    // Se o usuário já estiver logado, redireciona para o dashboard
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
