import prismaClient from "../../prisma/index.js";

interface ItemProps {
  order_id: string;
  product_id: string;
  amount: number;
}

class AddItemOrderService {
  async execute({ order_id, product_id, amount }: ItemProps) {
    try {
      const orderExists = await prismaClient.order.findFirst({
        where: { id: order_id },
      });
      if (!orderExists) throw new Error("Pedido não encontrado.");

      const productExists = await prismaClient.product.findFirst({
        where: { id: product_id },
      });
      if (!productExists) throw new Error("Produto não encontrado.");

      const item = await prismaClient.item.create({
        data: {
          order_id,
          product_id,
          amount,
          status: "DRAFT", // ✅ Nasce como rascunho
        },
        select: {
          id: true,
          amount: true,
          status: true,
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
      });

      return item;
    } catch (err: any) {
      if (
        err.message === "Pedido não encontrado." ||
        err.message === "Produto não encontrado."
      ) {
        throw new Error(err.message);
      }
      throw new Error("Falha ao adicionar item.");
    }
  }
}
export { AddItemOrderService };
