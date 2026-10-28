"use client";

import { useState } from "react";
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
import { Trash2, Loader2 } from "lucide-react";
import { deleteProductAction } from "@/actions/products";

interface DeleteProductDialogProps {
  productId: string;
  productName: string;
}

export function DeleteProductDialog({
  productId,
  productName,
}: DeleteProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setIsPending(true);
    const result = await deleteProductAction(productId);

    if (result.success) {
      toast.success("Produto excluído com sucesso!");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.error || "Erro ao excluir produto.");
    }
    setIsPending(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* ✅ Trigger da lixeira posicionado no canto */}
      <DialogTrigger className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:text-brand-primary transition-colors cursor-pointer z-20 backdrop-blur-sm">
        <Trash2 className="w-5 h-5" />
      </DialogTrigger>

      <DialogContent className="p-6 sm:p-8 bg-app-card border border-app-border text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-brand-primary">
            Excluir Produto
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Tem certeza que deseja excluir o produto{" "}
            <strong className="text-white">{productName}</strong>?
            <br />
            <br />
            <span className="text-brand-primary text-xs">
              Atenção: O produto será desativado e não aparecerá mais no
              cardápio.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className="border border-app-border bg-transparent text-white hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Cancelar
          </Button>

          <Button
            onClick={handleDelete}
            disabled={isPending}
            className="bg-brand-primary hover:bg-brand-primary/80 text-white"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Excluindo...
              </span>
            ) : (
              "Sim, excluir"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
