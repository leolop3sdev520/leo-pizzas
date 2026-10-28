import prismaClient from "../../prisma/index";

class CreateCategoryService {
  async execute(name: string) {
    try {
      const categoryExists = await prismaClient.category.findFirst({
        where: {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
      });

      if (categoryExists) {
        // ✅ Se a categoria existe e está desabilitada, nós reativamos ELA e os PRODUTOS
        if (categoryExists.disabled) {
          // Usamos uma transação para garantir que tudo seja atualizado junto
          const [reactivatedCategory] = await prismaClient.$transaction([
            // 1. Reativa a categoria
            prismaClient.category.update({
              where: {
                id: categoryExists.id,
              },
              data: {
                disabled: false,
              },
              select: {
                id: true,
                name: true,
                createdAt: true,
              },
            }),

            // 2. Reativa todos os produtos que pertencem a essa categoria
            prismaClient.product.updateMany({
              where: {
                category_id: categoryExists.id,
              },
              data: {
                disabled: false,
              },
            }),
          ]);

          return reactivatedCategory;
        }

        // Se existe e já está ativa, barra o erro
        throw new Error("Já existe uma categoria ativa com esse nome.");
      }

      // Se não existe, cria do zero
      const category = await prismaClient.category.create({
        data: {
          name: name,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      });

      return category;
    } catch (err: any) {
      console.log("ERRO AO CRIAR CATEGORIA:", err.message);
      throw new Error(err.message || "Falha ao criar categoria");
    }
  }
}

export { CreateCategoryService };
