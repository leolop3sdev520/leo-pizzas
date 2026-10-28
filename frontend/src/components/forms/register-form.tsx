"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { registerAction } from "@/actions/auth";

export function RegisterForm() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(registerAction, {
    success: false,
    error: "",
  });

  // Monitora o estado para disparar o Toast e Redirecionar
  useEffect(() => {
    if (state.success) {
      toast.success("Conta criada com sucesso! Redirecionando...");

      const timer = setTimeout(() => {
        router.push("/login");
      }, 2000);

      // Limpa o timer se o componente for desmontado antes dos 2 segundos
      return () => clearTimeout(timer);
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <Card className="bg-app-card border border-app-border w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-white text-center text-3xl sm:text-4xl font-bold">
          Leo<span className="text-brand-primary">Pizzas</span>
        </CardTitle>
        <CardDescription className="text-white text-center mt-2">
          Preencha os dados para criar sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" action={formAction}>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Nome
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Digite seu nome"
              required
              minLength={3}
              className="text-white bg-app-background border border-app-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              E-mail
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Digite seu email"
              required
              className="text-white bg-app-background border border-app-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Senha
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Digite sua senha"
              required
              className="text-white bg-app-background border border-app-border"
            />
          </div>

          {/* A mensagem de erro agora aparece via Toast, então removi o <p> daqui */}

          <Button
            type="submit"
            className="w-full bg-brand-primary text-white hover:bg-brand-primary/70"
          >
            {isPending ? "Cadastrando..." : "Cadastrar"}
          </Button>

          <p className="text-center text-white text-sm">
            Já possui uma conta?{" "}
            <Link href="/login" className="text-brand-primary hover:underline">
              Faça login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
