import prismaClient from "../../prisma/index.js";

class SendOrderService {
  async execute({ order_id }: { order_id: string }) {
    try {
      // ✅ Atualiza todos os itens DRAFT da mesa para PRODUCTION
      const updated = await prismaClient.item.updateMany({
        where: {
          order_id: order_id,
          status: "DRAFT",
        },
        data: {
          status: "PRODUCTION",
        },
      });

      if (updated.count === 0) {
        throw new Error("Não há novos itens em rascunho para enviar.");
      }

      return { message: "Itens enviados para produção com sucesso" };
    } catch (err: any) {
      throw new Error(err.message || "Falha ao enviar para produção.");
    }
  }
}
export { SendOrderService };
