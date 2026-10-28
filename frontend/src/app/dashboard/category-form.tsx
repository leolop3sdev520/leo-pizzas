"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createCategoryAction } from "@/actions/categories";

export function CategoryForm() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleCreateCategory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const result = await createCategoryAction(formData);

    if (result.success) {
      toast.success("Categoria criada com sucesso!");
      setOpen(false);

      // Atualiza os dados do servidor (puxa a nova categoria na hora)
      router.refresh();
    } else {
      toast.error(result.error || "Erro ao criar categoria.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center justify-center gap-2 bg-brand-primary text-white hover:bg-brand-primary/80 transition-colors px-4 py-2 rounded-md font-medium text-sm w-full sm:w-auto cursor-pointer">
        <Plus className="h-5 w-5" />
        Nova Categoria
      </DialogTrigger>

      <DialogContent className="p-6 sm:p-8 bg-app-card border border-app-border text-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Criar nova categoria</DialogTitle>
          <DialogDescription>
            Adicione uma nova categoria para organizar os produtos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateCategory} className="space-y-6 mt-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="block">
              Nome da categoria
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Digite o nome da categoria..."
              className="border-app-border bg-app-background text-white p-6"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-primary text-white hover:bg-brand-primary/80 h-12"
          >
            Criar categoria
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
