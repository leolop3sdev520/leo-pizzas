export const instant = false;

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Order, Product } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ManageOrderDialog } from "@/components/dashboard/manage-order-dialog";
import { CreateOrderDialog } from "@/components/dashboard/create-order-dialog";
import { Utensils } from "lucide-react";

export default async function Tables() {
  const token = await getToken();

  const [orders, products] = await Promise.all([
    apiClient<Order[]>("/orders?view=tables", { token: token! }),
    apiClient<Product[]>("/products", { token: token! }),
  ]);

  return (
    <div className="space-y-4 sm:*:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Mesas Abertas
          </h1>
          <p className="text-sm sm:text-base mt-1 text-gray-400">
            Gerencie o consumo das mesas
          </p>
        </div>
        <CreateOrderDialog />
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-app-card border border-app-border rounded-xl flex flex-col items-center">
          <Utensils className="w-10 h-10 mb-3 opacity-50" />
          Nenhuma mesa aberta no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {orders.map((order) => {
            const total = order.items.reduce(
              (acc, item) => acc + item.amount * item.product.price,
              0,
            );

            return (
              // ✅ Adicionado flex, flex-col e h-full para igualar a altura
              <Card
                key={order.id}
                className="bg-app-card border border-app-border text-white flex flex-col h-full"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    Mesa {order.table}
                  </CardTitle>
                  <p className="text-sm text-gray-400">
                    Cliente: {order.name || "Não informado"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Garçom: {order.user?.name}
                  </p>
                </CardHeader>

                {/* ✅ flex-1 e flex-col para esticar o conteúdo */}
                <CardContent className="flex flex-col flex-1 space-y-4 pt-4">
                  <div className="flex justify-between items-center border-t border-zinc-800 pt-3">
                    <span className="text-sm text-gray-400">Total Atual:</span>
                    <span className="font-bold text-brand-primary">
                      R$ {(total / 100).toFixed(2)}
                    </span>
                  </div>

                  {/* mt-auto empurra o botão para o final do card */}
                  <div className="mt-auto pt-2">
                    <ManageOrderDialog order={order} products={products} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
