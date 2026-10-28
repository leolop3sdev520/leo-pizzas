"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Clock } from "lucide-react";
import { Order } from "@/lib/types";
import { finishItemAction } from "@/actions/orders";

export function OrderProductionCard({ order }: { order: Order }) {
  const [isPending, setIsPending] = useState(false);
  const [elapsedTime, setElapsedTime] = useState("");
  const [timeColor, setTimeColor] = useState("text-app-success");
  const router = useRouter();

  // Filtra para mostrar APENAS o que precisa ser feito agora
  const productionItems = order.items.filter(
    (item) => item.status === "PRODUCTION",
  );

  // ✅ UX: Contador de tempo real
  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(order.createdAt).getTime();
      const now = new Date().getTime();
      const diffInMinutes = Math.floor((now - start) / 60000);

      if (diffInMinutes < 60) {
        setElapsedTime(`${diffInMinutes} min`);
      } else {
        const hours = Math.floor(diffInMinutes / 60);
        const mins = diffInMinutes % 60;
        setElapsedTime(`${hours}h ${mins}m`);
      }

      // Lógica de cores do tempo (Verde < 10min, Laranja < 20min, Vermelho > 20min)
      if (diffInMinutes >= 20) {
        setTimeColor("text-app-danger animate-pulse");
      } else if (diffInMinutes >= 10) {
        setTimeColor("text-app-warning");
      } else {
        setTimeColor("text-app-success");
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000); // Atualiza a cada 1 minuto

    return () => clearInterval(interval);
  }, [order.createdAt]);

  async function handleFinishItem(itemId: string) {
    setIsPending(true);
    const result = await finishItemAction(itemId);
    if (result.success) {
      toast.success("Item pronto e entregue!", {
        description: "O item foi removido da tela da cozinha.",
        duration: 3000,
      });
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  }

  return (
    <Card className="bg-app-card border border-app-border text-app-text flex flex-col h-full border-l-4 border-l-brand-primary rounded-xl overflow-hidden shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-3 bg-app-card">
        {" "}
        {/* Fundo levemente diferente no header */}
        <div>
          <CardTitle className="text-2xl font-bold">
            Mesa {order.table}
          </CardTitle>
          <p className="text-sm text-app-text/60 mt-1">
            Garçom: {order.user?.name}
          </p>
        </div>
        {/* ✅ Contador de Tempo em destaque */}
        <div
          className={`flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-full bg-black/20 ${timeColor}`}
        >
          <Clock className="w-4 h-4" />
          <span className="text-sm">{elapsedTime}</span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col pt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-app-text/80 uppercase tracking-wider">
            Para preparar:
          </p>
          <span className="bg-brand-primary/20 text-brand-primary text-xs px-2 py-1 rounded font-bold">
            {productionItems.length} itens
          </span>
        </div>

        {/* ✅ Agrupamento visual com linhas divisórias em vez de caixas */}
        <ul className="flex flex-col">
          {productionItems.map((item, index) => (
            <li
              key={item.id}
              className={`flex justify-between items-center py-4 ${index !== productionItems.length - 1 ? "border-b border-app-border/50" : ""}`}
            >
              <div className="flex items-start gap-3">
                <span className="bg-[#2b0e05] text-app-text font-bold text-sm w-8 h-8 flex items-center justify-center rounded-md">
                  {item.amount}x
                </span>
                <div>
                  <p className="font-bold text-lg leading-tight">
                    {item.product.name}
                  </p>
                </div>
              </div>

              {/* ✅ Botão Sólido e Maior (Fitts's Law) */}
              <Button
                onClick={() => handleFinishItem(item.id)}
                disabled={isPending}
                className="bg-app-success hover:bg-app-success/80 text-white font-bold h-10 px-4 rounded-md transition-all shadow-md"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Pronto
                  </>
                )}
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
