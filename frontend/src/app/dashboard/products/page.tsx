export const instant = false;

import { apiClient } from "@/lib/api";
import { getToken, getUser } from "@/lib/auth";
import { Category, Product } from "@/lib/types";
import { ProductForm } from "@/components/dashboard/product-form";
import { EditProductDialog } from "@/components/dashboard/edit-product-dialog";
import { Package, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default async function Products() {
  const token = await getToken();
  const user = await getUser();
  const isAdmin = user?.role === "ADMIN";

  const [activeProducts, disabledProducts, categories] = await Promise.all([
    apiClient<Product[]>("/products", { token: token! }),
    apiClient<Product[]>("/products?disabled=true", { token: token! }),
    apiClient<Category[]>("/category", { token: token! }),
  ]);

  const allProducts = [...activeProducts, ...disabledProducts];

  const sortedCategories = categories.sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const groupedProducts = sortedCategories
    .map((category) => {
      const productsInCategory = allProducts.filter(
        (p) => p.category_id === category.id,
      );

      productsInCategory.sort((a, b) => {
        if (a.disabled === b.disabled) return a.name.localeCompare(b.name);
        return a.disabled ? 1 : -1;
      });

      return {
        ...category,
        products: productsInCategory,
      };
    })
    .filter((group) => group.products.length > 0);

  return (
    <div className="space-y-8 max-w-350">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-app-text">
            Produtos
          </h1>
          <p className="text-sm sm:text-base mt-1 text-app-text/60">
            Gerencie os produtos do cardápio divididos por categoria
          </p>
        </div>
        {isAdmin && <ProductForm categories={sortedCategories} />}
      </div>

      {/* Listagem Agrupada */}
      {groupedProducts.length === 0 ? (
        <div className="p-12 text-center text-app-text/50 bg-app-card border border-app-border rounded-xl flex flex-col items-center">
          <Layers className="w-12 h-12 mb-4 opacity-30" />
          <p>Nenhum produto cadastrado.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedProducts.map((group) => (
            <div key={group.id} className="space-y-4">
              {/* Título e Contador */}
              <div className="flex items-center gap-3 border-b border-app-border/50 pb-2">
                <h2 className="text-xl font-bold text-app-text flex items-center gap-2">
                  <span className="w-2 h-6 bg-brand-primary rounded-full inline-block"></span>
                  {group.name}
                </h2>
                <span className="text-xs font-medium text-app-text/50 bg-app-card border border-app-border px-2.5 py-0.5 rounded-full">
                  {group.products.length}{" "}
                  {group.products.length === 1 ? "item" : "itens"}
                </span>
              </div>

              {/* ✅ CORREÇÃO DO GRID: Colunas fixas para alinhamento perfeito à esquerda */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {group.products.map((product) => {
                  return (
                    <Card
                      key={product.id}
                      className={`w-full bg-app-card border border-app-border flex flex-row items-center p-3 gap-4 transition-all hover:border-brand-primary/50 relative overflow-hidden rounded-xl ${product.disabled ? "opacity-70" : ""}`}
                    >
                      {/* Miniatura da Imagem */}
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-[#2b0e05]">
                        <Image
                          src={product.banner}
                          alt={product.name}
                          fill
                          className={`object-cover ${product.disabled ? "grayscale" : ""}`}
                          sizes="96px"
                        />

                        {product.disabled && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                            <span className="bg-app-danger text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-1 rounded text-center leading-tight shadow-sm">
                              Fora do
                              <br />
                              Cardápio
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Informações do Produto */}
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Package className="w-4 h-4 text-brand-primary shrink-0" />
                          <h3 className="font-bold text-sm sm:text-base text-app-text truncate">
                            {product.name}
                          </h3>
                        </div>
                        <p className="text-xs text-app-text/50 truncate mb-2">
                          {product.description}
                        </p>

                        <div className="flex items-center gap-3 mt-auto">
                          <span className="text-brand-primary font-bold text-sm whitespace-nowrap">
                            {(product.price / 100).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Botão de Editar */}
                      {isAdmin && (
                        <div className="shrink-0 ml-auto flex items-center justify-center">
                          <EditProductDialog
                            product={product}
                            categories={sortedCategories}
                          />
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
