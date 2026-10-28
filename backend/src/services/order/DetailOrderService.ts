import prismaClient from "../../prisma/index";

interface OrderProps {
  order_id: string;
}

class DetailOrderService {
  async execute({ order_id }: OrderProps) {
    try {
      // Busca o pedido e traz os itens e detalhes do produto atrelados a ele
      const order = await prismaClient.order.findFirst({
        where: {
          id: order_id,
        },
        select: {
          id: true,
          table: true,
          name: true,
          draft: true,
          status: true,
          createdAt: true,
          items: {
            select: {
              id: true,
              amount: true,
              createdAt: true,
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
      });

      // Se não achar o pedido, lança o erro
      if (!order) {
        throw new Error("Pedido não encontrado.");
      }

      return order;
    } catch (err: any) {
      // Mantém a mensagem específica se for o erro de não encontrado
      if (err.message === "Pedido não encontrado.") {
        throw new Error(err.message);
      }

      console.log(err);
      throw new Error("Falha ao buscar os detalhes do pedido.");
    }
  }
}

export { DetailOrderService };
