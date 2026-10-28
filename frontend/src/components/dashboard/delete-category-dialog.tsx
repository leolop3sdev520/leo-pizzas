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
import { deleteCategoryAction } from "@/actions/categories";

interface DeleteCategoryDialogProps {
  categoryId: string;
  categoryName: string;
}

export function DeleteCategoryDialog({
  categoryId,
  categoryName,
}: DeleteCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setIsPending(true);
    const result = await deleteCategoryAction(categoryId);

    if (result.success) {
      toast.success("Categoria excluída com sucesso!");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.error || "Erro ao excluir categoria.");
    }
    setIsPending(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="absolute top-4 right-4 text-zinc-500 hover:text-brand-primary transition-colors cursor-pointer z-10">
        <Trash2 className="w-5 h-5" />
      </DialogTrigger>

      <DialogContent className="p-6 sm:p-8 bg-app-card border border-app-border text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white-500">
            Excluir Categoria
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Tem certeza que deseja excluir a categoria{" "}
            <strong className="text-white">{categoryName}</strong>?
            <br />
            <br />
            <span className="text-red-400 text-xs">
              Atenção: Todos os produtos vinculados a esta categoria também
              serão excluídos permanentemente.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className="border border-app-border bg-transparent text-white hover:bg-zinc-800 transition-colors"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-500 hover:bg-red-600 text-white"
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
