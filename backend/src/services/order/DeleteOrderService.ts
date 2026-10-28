import prismaClient from "../../prisma/index.js";

class DeleteOrderService {
  async execute({ order_id }: { order_id: string }) {
    try {
      // Aqui deletamos o pedido inteiro (fechar a conta)
      await prismaClient.order.delete({ where: { id: order_id } });
      return { message: "Mesa finalizada e pedido fechado com sucesso." };
    } catch (err) {
      throw new Error("Falha ao fechar o pedido.");
    }
  }
}
export { DeleteOrderService };
