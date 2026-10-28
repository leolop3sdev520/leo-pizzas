import prismaClient from "../../prisma/index.js";

interface ListOrdersServiceProps {
  draft?: string;
  view?: string; // "tables" ou "kitchen"
}

class ListOrdersService {
  async execute({ draft, view }: ListOrdersServiceProps) {
    // Se for a cozinha, buscamos apenas mesas que tenham algum item em PRODUCTION
    const whereCondition =
      view === "kitchen"
        ? { status: false, items: { some: { status: "PRODUCTION" } } }
        : view === "tables"
          ? { status: false, draft: true } // Mesas abertas (rascunhos ou não)
          : { draft: draft === "true" ? true : false };

    const orders = await prismaClient.order.findMany({
      where: whereCondition,
      select: {
        id: true,
        table: true,
        name: true,
        status: true,
        createdAt: true,
        user: { select: { name: true } },
        items: {
          select: {
            id: true,
            amount: true,
            status: true, // ✅ Importante trazer o status do item
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                description: true,
                banner: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  }
}
export { ListOrdersService };
