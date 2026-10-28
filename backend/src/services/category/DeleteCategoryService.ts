import prismaClient from "../../prisma/index.js"; // Lembre-se do .js se for ESM

class DeleteCategoryService {
  async execute(id: string) {
    try {
      // Usamos uma transação para garantir a integridade
      await prismaClient.$transaction([
        // 1. Desabilita todos os produtos desta categoria
        prismaClient.product.updateMany({
          where: { category_id: id },
          data: { disabled: true },
        }),

        // 2. Desabilita a própria categoria
        prismaClient.category.update({
          where: { id: id },
          data: { disabled: true },
        }),
      ]);

      return { message: "Categoria e produtos desabilitados com sucesso" };
    } catch (error) {
      console.log(error);
      throw new Error("Falha ao desabilitar a categoria e seus produtos");
    }
  }
}

// ✅ ESSA É A LINHA MÁGICA QUE ESTAVA FALTANDO OU ERRADA
export { DeleteCategoryService };
