import prismaClient from "../../prisma/index.js";

class ListCategoryService {
  async execute() {
    try {
      const categories = await prismaClient.category.findMany({
        // ✅ O FILTRO FICA AQUI
        where: {
          disabled: false,
        },
        // O SELECT SÓ DIZ O QUE RETORNAR
        select: {
          id: true,
          name: true,
          disabled: true,
          createdAt: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return categories;
    } catch (err) {
      console.log(err);
      throw new Error("Falha ao buscar categorias");
    }
  }
}

export { ListCategoryService };
