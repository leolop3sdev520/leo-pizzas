import prismaClient from "../../prisma/index";

interface OrderProps {
  order_id: string;
}

class FinishOrderService {
  async execute({ order_id }: OrderProps) {
    try {
      // 1. Verifica se o pedido existe
      const order = await prismaClient.order.findFirst({
        where: {
          id: order_id,
        },
      });

      if (!order) {
        throw new Error("Pedido não encontrado.");
      }

      // 2. Regra de negócio: não pode finalizar se ainda for rascunho
      if (order.draft === true) {
        throw new Error("Este pedido ainda é um rascunho. Envie para produção antes de finalizar.");
      }

      // 3. Regra de negócio: não pode finalizar se já estiver finalizado
      if (order.status === true) {
        throw new Error("Este pedido já está finalizado.");
      }

      // 4. Atualiza o status para true (Finalizado)
      const updatedOrder = await prismaClient.order.update({
        where: {
          id: order_id,
        },
        data: {
          status: true,
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

      return updatedOrder;
    } catch (err: any) {
      if (
        err.message === "Pedido não encontrado." ||
        err.message === "Este pedido ainda é um rascunho. Envie para produção antes de finalizar." ||
        err.message === "Este pedido já está finalizado."
      ) {
        throw new Error(err.message);
      }

      console.log(err);
      throw new Error("Falha ao finalizar o pedido.");
    }
  }
}

export { FinishOrderService };