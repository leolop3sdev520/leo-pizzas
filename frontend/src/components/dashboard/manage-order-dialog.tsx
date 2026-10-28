"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Loader2, Trash2, Send, AlertTriangle } from "lucide-react";
import { Order, Product } from "@/lib/types";
import {
  addItemAction,
  sendOrderAction,
  removeItemAction,
  finishTableAction,
} from "@/actions/orders";

export function ManageOrderDialog({
  order,
  products,
}: {
  order: Order;
  products: Product[];
}) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [view, setView] = useState<"items" | "send" | "finish">("items");

  const [selectedProduct, setSelectedProduct] = useState("");
  const [amount, setAmount] = useState(1);
  const router = useRouter();

  const total = order.items.reduce(
    (acc, item) => acc + item.amount * item.product.price,
    0,
  );
  const draftItems = order.items.filter((i) => i.status === "DRAFT");

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct) return toast.error("Selecione um produto.");
    setIsPending(true);
    const formData = new FormData();
    formData.append("order_id", order.id);
    formData.append("product_id", selectedProduct);
    formData.append("amount", amount.toString());

    const result = await addItemAction(formData);
    if (result.success) {
      toast.success("Item adicionado!");
      setSelectedProduct("");
      setAmount(1);
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  }

  async function handleRemoveItem(id: string) {
    setIsPending(true);
    const result = await removeItemAction(id);
    if (result.success) {
      toast.success("Removido!");
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  }

  async function handleSend() {
    setIsPending(true);
    const result = await sendOrderAction(order.id);
    if (result.success) {
      toast.success("Enviado p/ Cozinha!");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  }

  async function handleFinishTable() {
    setIsPending(true);
    const result = await finishTableAction(order.id);
    if (result.success) {
      toast.success("Mesa fechada com sucesso!");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  }

  function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => setView("items"), 300);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="w-full bg-zinc-800 hover:bg-zinc-700 text-white h-10 px-4 rounded-md font-medium text-sm transition-colors cursor-pointer">
        Gerenciar Mesa {order.table}
      </DialogTrigger>

      <DialogContent className="p-6 bg-app-card border border-app-border text-white sm:max-w-xl max-h-[90vh] overflow-y-auto">
        {view === "items" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Mesa {order.table} - {order.name}
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div className="bg-app-background p-4 rounded-lg border border-app-border">
                <h3 className="text-sm font-bold text-gray-300 mb-2">
                  Itens Consumidos:
                </h3>
                <ul className="space-y-3">
                  {order.items.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Nenhum item na mesa.
                    </p>
                  ) : (
                    order.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2 last:border-0"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold">
                            {item.amount}x {item.product.name}
                          </span>
                          <span
                            className={`text-xs ${item.status === "DRAFT" ? "text-yellow-500" : item.status === "PRODUCTION" ? "text-orange-500" : "text-green-500"}`}
                          >
                            {item.status === "DRAFT"
                              ? "Em Rascunho"
                              : item.status === "PRODUCTION"
                                ? "Na Cozinha"
                                : "Entregue"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-400">
                            R${" "}
                            {((item.amount * item.product.price) / 100).toFixed(
                              2,
                            )}
                          </span>
                          {item.status === "DRAFT" && (
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isPending}
                              className="text-zinc-500 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <form onSubmit={handleAddItem} className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-1 block">
                    Adicionar Produto
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full h-10 rounded-md border border-app-border bg-app-background px-3 text-sm text-white"
                  >
                    <option value="" disabled>
                      Selecione...
                    </option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - R$ {(p.price / 100).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-20">
                  <label className="text-xs text-gray-400 mb-1 block">
                    Qtd
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-10 rounded-md border border-app-border bg-app-background px-3 text-sm text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-10 bg-brand-primary hover:bg-brand-primary/80 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </form>

              <div className="flex items-center justify-between border-t border-zinc-800 pt-4 mt-6">
                <div>
                  <p className="text-xs text-gray-400">Total da Mesa</p>
                  <p className="text-xl font-bold text-brand-primary">
                    R$ {(total / 100).toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setView("finish")}
                    disabled={isPending}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 transition-all"
                  >
                    Fechar Conta
                  </Button>
                  <Button
                    onClick={() => setView("send")}
                    disabled={isPending || draftItems.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white gap-2"
                  >
                    Enviar p/ Cozinha
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {view === "send" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Send className="text-green-500 w-6 h-6" />
                Confirmar Envio
              </DialogTitle>
              <DialogDescription className="text-gray-400 mt-2">
                Enviar os itens em rascunho para a cozinha?
              </DialogDescription>
            </DialogHeader>

            <div className="bg-app-background p-4 rounded-lg border border-app-border mt-4">
              <ul className="space-y-1 mb-3">
                {draftItems.map((item) => (
                  <li key={item.id} className="text-sm font-bold">
                    {item.amount}x {item.product.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setView("items")}
                disabled={isPending}
                className="border border-app-border bg-transparent text-white hover:bg-zinc-700 hover:text-white transition-colors"
              >
                Voltar
              </Button>
              <Button
                onClick={handleSend}
                disabled={isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Confirmar Envio
              </Button>
            </div>
          </>
        )}

        {view === "finish" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white-500">
                <AlertTriangle className="w-6 h-6" />
                Fechar Conta da Mesa
              </DialogTitle>
              <DialogDescription className="text-gray-400 mt-2">
                Você tem certeza que deseja fechar a conta da{" "}
                <strong>Mesa {order.table}</strong>?
                <br />
                <br />O valor total foi de{" "}
                <strong className="text-white">
                  R$ {(total / 100).toFixed(2)}
                </strong>
                .
                <br />
                <br />
                <span className="text-red-400 text-xs">
                  Atenção: Todos os itens e registros desta mesa serão apagados
                  permanentemente.
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-3 mt-8">
              <Button
                variant="outline"
                onClick={() => setView("items")}
                disabled={isPending}
                className="border border-app-border bg-transparent text-white hover:bg-zinc-700 hover:text-white transition-colors"
              >
                Cancelar
              </Button>

              <Button
                onClick={handleFinishTable}
                disabled={isPending}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Sim, fechar conta
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
