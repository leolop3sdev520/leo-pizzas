export const instant = false;

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Order } from "@/lib/types";
import { Utensils, ChefHat } from "lucide-react";
import { RefreshOrdersButton } from "@/components/dashboard/refresh-orders-button";
import { OrderProductionCard } from "@/components/dashboard/order-production-card";

export default async function DashboardOrders() {
  const token = await getToken();

  const orders = await apiClient<Order[]>("/orders?view=kitchen", {
    token: token!,
  });

  // Calcula o total de itens pendentes para o resumo no topo
  const totalItems = orders.reduce(
    (acc, order) =>
      acc + order.items.filter((i) => i.status === "PRODUCTION").length,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-app-border/50 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-brand-primary" />
            <h1 className="text-3xl font-bold text-app-text">Cozinha</h1>
          </div>
          <p className="text-base mt-1 text-app-text/60">
            {orders.length === 0
              ? "Nenhum pedido pendente no momento."
              : `${orders.length} mesas aguardando | ${totalItems} itens para preparar`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-app-text/40 font-medium hidden sm:block">
            Auto-refresh ativo
          </span>
          <RefreshOrdersButton />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-app-card border border-app-border rounded-2xl text-app-text/50">
          <Utensils className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg font-medium">
            Cozinha limpa! Nenhum pedido em produção.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
          {orders.map((order) => (
            <OrderProductionCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
