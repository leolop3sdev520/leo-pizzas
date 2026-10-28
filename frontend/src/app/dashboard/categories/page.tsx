export const instant = false;

import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getToken, getUser } from "@/lib/auth";
import { Category } from "@/lib/types";
import { Tags } from "lucide-react";
import { CategoryForm } from "@/components/dashboard/category-form";
import { DeleteCategoryDialog } from "@/components/dashboard/delete-category-dialog";

export default async function Categories() {
  const token = await getToken();
  const user = await getUser();
  const isAdmin = user?.role === "ADMIN";

  const data = await apiClient<Category[]>("/category", {
    token: token!,
  });

  const categories = data.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-4 sm:*:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Categorias
          </h1>
          <p className="text-sm sm:text-base mt-1 text-gray-400">
            Organize os produtos em categorias
          </p>
        </div>

        {isAdmin && <CategoryForm />}
      </div>

      {categories.length !== 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {categories.map((category) => (
            <Card
              key={category.id}
              // O 'relative' é essencial para posicionar a lixeira no canto
              className="bg-app-card border border-zinc-700 transition-shadow hover:shadow-md text-white h-full flex flex-col relative group"
            >
              {/* ✅ A lixeira agora fica sempre visível (removido o opacity-0) */}
              {isAdmin && (
                <DeleteCategoryDialog
                  categoryId={category.id}
                  categoryName={category.name}
                />
              )}

              <CardHeader>
                <CardTitle className="gap-2 flex items-center text-base md:text-lg pr-8">
                  <Tags className="w-5 h-5"></Tags>
                  <span>{category.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-400 text-xs break-all">{category.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
