"use client";

import { useState, useRef } from "react";
import type { FormEvent, ChangeEvent } from "react";
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
import { Plus, Upload, X, Loader2 } from "lucide-react"; // ✅ Importado o Loader2
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createProductAction } from "@/actions/products";
import { Category } from "@/lib/types";

interface ProductFormProps {
  categories: Category[];
}

export function ProductForm({ categories }: ProductFormProps) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false); // ✅ Estado de carregamento

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handlePriceChange(e: ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, "");
    if (value) {
      const numberValue = Number(value) / 100;
      setPrice(
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(numberValue),
      );
    } else {
      setPrice("");
    }
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function removeImage() {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleCreateProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // ✅ Ativa o modo carregando
    setIsPending(true);

    try {
      const formData = new FormData(e.currentTarget);

      const rawPrice = formData.get("price") as string;
      const priceInCents = rawPrice.replace(/\D/g, "");
      formData.set("price", priceInCents);

      const result = await createProductAction(formData);

      if (result.success) {
        toast.success("Produto criado com sucesso!");
        handleOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao criar produto.");
      }
    } catch (error) {
      toast.error("Ocorreu um erro inesperado.");
    } finally {
      // ✅ Desativa o modo carregando, independente de erro ou sucesso
      setIsPending(false);
    }
  }

  function handleOpenChange(newOpen: boolean) {
    // Se o modal estiver tentando fechar enquanto cria, ignora (opcional, mas seguro)
    if (isPending && !newOpen) return;

    setOpen(newOpen);
    if (!newOpen) {
      setPrice("");
      removeImage();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="flex items-center justify-center gap-2 bg-brand-primary text-white hover:bg-brand-primary/80 transition-colors px-4 py-2 rounded-md font-medium text-sm w-full sm:w-auto cursor-pointer">
        <Plus className="h-5 w-5" />
        Novo Produto
      </DialogTrigger>

      <DialogContent className="p-6 sm:p-8 bg-app-card border border-app-border text-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center items-center">
          <DialogTitle className="text-xl font-bold">
            Criar novo produto
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isPending
              ? "Aguarde, estamos salvando o produto..."
              : "Criando novo produto..."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateProduct} className="space-y-5 mt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome do produto</Label>
            <Input
              id="name"
              name="name"
              placeholder="Digite o nome do produto..."
              className="border-app-border bg-app-background text-white p-6"
              required
              disabled={isPending} // ✅ Desabilita os inputs enquanto salva
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              name="price"
              type="text"
              placeholder="Ex: 35,00"
              value={price}
              onChange={handlePriceChange}
              className="border-app-border bg-app-background text-white p-6"
              required
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descrição</Label>
            <textarea
              id="description"
              name="description"
              placeholder="Digite a descrição do produto..."
              rows={3}
              className="flex w-full rounded-md border border-app-border bg-app-background px-3 py-3 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary resize-none disabled:opacity-50"
              required
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category_id">Categoria</Label>
            <select
              id="category_id"
              name="category_id"
              required
              defaultValue=""
              disabled={isPending}
              className="flex h-11.5 w-full rounded-md border border-app-border bg-app-background px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary disabled:opacity-50"
            >
              <option value="" disabled className="text-gray-400">
                Selecione uma categoria
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Imagem do produto</Label>
            <div
              className={`relative w-full h-40 border-2 border-dashed border-app-border rounded-lg flex flex-col items-center justify-center transition-colors overflow-hidden ${isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-white/5 cursor-pointer"}`}
            >
              <input
                type="file"
                name="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                required={!imagePreview}
                disabled={isPending}
              />

              {!imagePreview ? (
                <div className="flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-sm font-semibold text-white">
                    Clique para selecionar uma imagem
                  </span>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={isPending}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full z-20 transition-colors disabled:opacity-50"
                    title="Remover imagem"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending} // ✅ Desabilita o botão
            className="w-full bg-brand-primary text-white hover:bg-brand-primary/80 h-12 mt-4 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Criando produto...
              </span>
            ) : (
              "Criar produto"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
