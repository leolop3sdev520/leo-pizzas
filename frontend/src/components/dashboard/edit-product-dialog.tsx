"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Upload, X, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateProductAction } from "@/actions/products";
import { Category, Product } from "@/lib/types";

interface EditProductDialogProps {
  product: Product;
  categories: Category[];
}

export function EditProductDialog({
  product,
  categories,
}: EditProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const initialPrice = (product.price / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const [price, setPrice] = useState(initialPrice);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handlePriceChange(e: ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, "");
    if (value) {
      setPrice(
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(value) / 100),
      );
    } else setPrice("");
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleUpdateProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);

    try {
      const formData = new FormData(e.currentTarget);
      const rawPrice = formData.get("price") as string;
      formData.set("price", rawPrice.replace(/\D/g, ""));

      const result = await updateProductAction(formData, product.id);

      if (result.success) {
        toast.success("Produto atualizado com sucesso!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro inesperado.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* ✅ Botão Lápis ajustado para a lista (sem absolute) */}
      <DialogTrigger className="flex items-center justify-center w-10 h-10 bg-[#2b0e05] hover:bg-brand-primary/20 rounded-lg text-app-text/60 hover:text-brand-primary transition-colors cursor-pointer border border-app-border">
        <Pencil className="w-4 h-4" />
      </DialogTrigger>

      <DialogContent className="p-6 sm:p-8 bg-app-card border border-app-border text-app-text sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Editar Produto
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdateProduct} className="space-y-4 mt-4">
          <div className="flex items-center gap-3 bg-[#2b0e05] p-4 rounded-lg border border-app-border mb-4">
            <input
              type="checkbox"
              id="disabled"
              name="disabled"
              value="true"
              defaultChecked={product.disabled}
              className="w-5 h-5 accent-brand-primary cursor-pointer"
            />
            <Label
              htmlFor="disabled"
              className="text-sm cursor-pointer font-medium"
            >
              Retirar este produto do cardápio (Desabilitar)
            </Label>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome do produto</Label>
            <Input
              id="name"
              name="name"
              defaultValue={product.name}
              className="p-6"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                name="price"
                type="text"
                value={price}
                onChange={handlePriceChange}
                className="p-6"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="category_id">Categoria</Label>
              <select
                id="category_id"
                name="category_id"
                defaultValue={product.category_id}
                required
                className="flex h-13.5 w-full rounded-md border border-app-border bg-[#2b0e05] px-3 py-2 text-sm text-app-text focus-visible:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descrição</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={product.description}
              rows={3}
              className="flex w-full rounded-md border border-app-border bg-[#2b0e05] px-3 py-3 text-sm text-app-text focus-visible:outline-none resize-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              Imagem do Produto (Deixe em branco para manter a atual)
            </Label>
            <div className="relative w-full h-40 border-2 border-dashed border-app-border rounded-lg flex flex-col items-center justify-center hover:bg-[#2b0e05] transition-colors cursor-pointer overflow-hidden">
              <input
                type="file"
                name="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {!imagePreview && !product.banner ? (
                <div className="flex flex-col items-center justify-center text-app-text/40 pointer-events-none">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-sm font-semibold text-app-text">
                    Clique para selecionar uma imagem
                  </span>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={imagePreview || product.banner}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-app-danger text-white p-1.5 rounded-full z-20"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 mt-4 bg-brand-primary text-brand-primary-foreground font-bold hover:bg-brand-primary/80"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Salvando...
              </span>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
