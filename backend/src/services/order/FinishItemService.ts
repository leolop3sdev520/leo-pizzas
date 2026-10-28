import prismaClient from "../../prisma/index.js";

class FinishItemService {
  async execute({ item_id }: { item_id: string }) {
    try {
      // Muda apenas o item específico para entregue
      const item = await prismaClient.item.update({
        where: { id: item_id },
        data: { status: "DELIVERED" },
      });
      return item;
    } catch (err) {
      throw new Error("Falha ao finalizar o item.");
    }
  }
}
export { FinishItemService };
