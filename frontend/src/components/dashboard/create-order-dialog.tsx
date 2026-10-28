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
import { Plus, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createOrderAction } from "@/actions/orders";

export function CreateOrderDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleCreateOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    const result = await createOrderAction(new FormData(e.currentTarget));

    if (result.success) {
      toast.success("Mesa aberta!");
      setOpen(false);
      router.refresh();
    } else toast.error(result.error);
    setIsPending(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/80 text-white h-10 px-4 rounded-md font-medium text-sm transition-colors cursor-pointer w-full sm:w-auto">
        <Plus className="w-5 h-5" /> Abrir Mesa
      </DialogTrigger>
      <DialogContent className="p-6 sm:p-8 bg-app-card border border-app-border text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Abrir Nova Mesa
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Inicie um novo pedido informando a mesa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateOrder} className="space-y-4 mt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="table">Número da Mesa</Label>
            <Input
              id="table"
              name="table"
              type="number"
              min="1"
              placeholder="Ex: 5"
              // ✅ AQUI ESTÃO AS CLASSES QUE REMOVEM AS SETINHAS
              className="border-app-border bg-app-background text-white p-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome do Cliente (Opcional)</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: João"
              className="border-app-border bg-app-background text-white p-6"
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-brand-primary hover:bg-brand-primary/80 text-white h-12 mt-2"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Abrir Mesa"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
