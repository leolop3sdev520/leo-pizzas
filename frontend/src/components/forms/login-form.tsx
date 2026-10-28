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
import { loginAction } from "@/actions/auth";

export function LoginForm() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(loginAction, {
    success: false,
    error: "",
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Login realizado com sucesso!"); // Mensagem de login

      const timer = setTimeout(() => {
        router.refresh();
        router.push(state.redirectTo!);
      }, 1500);

      return () => clearTimeout(timer);
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <Card className="bg-app-card/90 backdrop-blur-sm border border-white/10 shadow-2xl w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-white text-center text-3xl sm:text-4xl font-bold">
          Leo<span className="text-brand-primary">Pizzas</span>
        </CardTitle>
        <CardDescription className="text-white text-center mt-2">
          Preencha os dados para entrar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" action={formAction}>
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

          <Button
            type="submit"
            // 1. Desabilita o botão se estiver carregando OU se já deu sucesso
            disabled={isPending || state.success}
            className="w-full bg-brand-primary text-white hover:bg-brand-primary/70 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {/* 2. A lógica do texto: Se pendente, "Acessando...". Se já deu sucesso, "Sucesso!". Senão, "Acessar" */}
            {isPending
              ? "Acessando..."
              : state.success
                ? "Logado! Redirecionando..."
                : "Acessar"}
          </Button>

          {/* <p className="text-center text-white text-sm">
            Não possui uma conta?{" "}
            <Link
              href="/register"
              className="text-brand-primary hover:underline"
            >
              Crie uma conta
            </Link>
          </p> */}
        </form>
      </CardContent>
    </Card>
  );
}
