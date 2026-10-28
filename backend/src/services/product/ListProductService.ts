import prismaClient from "../../prisma/index";

// Interface que define o que o service espera receber.
// O `disabled` já chega como boolean (o schema Zod fez a conversão).
interface ListProductServiceProps {
  disabled: boolean;
}

class ListProductService {
  async execute({ disabled }: ListProductServiceProps) {
    // Busca todos os produtos filtrando pelo campo `disabled`.
    // O `include` traz a categoria relacionada para o front
    // (assim o front não precisa fazer uma segunda requisição).
    const products = await prismaClient.product.findMany({
      where: {
        disabled: disabled,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        banner: true,
        disabled: true,
        category_id: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Mais recentes primeiro
      },
    });

    return products;
  }
}

export { ListProductService };
