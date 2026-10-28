import prismaClient from "../../prisma/index";

interface CreateOrderServiceProps {
  table: number;
  name?: string;
  user_id: string; // ✅ Adicionado aqui
}

class CreateOrderService {
  async execute({ table, name, user_id }: CreateOrderServiceProps) {
    try {
      const order = await prismaClient.order.create({
        data: {
          table,
          name: name || null,
          user_id, // ✅ Salvando no banco
        },
        select: {
          id: true,
          table: true,
          name: true,
          draft: true,
          status: true,
          createdAt: true,
        },
      });

      return order;
    } catch (err) {
      console.log(err);
      throw new Error("Falha ao criar o pedido");
    }
  }
}

export { CreateOrderService };
