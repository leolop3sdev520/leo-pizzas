import prismaClient from "../../prisma/index";

interface ItemProps {
  item_id: string;
}

class RemoveItemOrderService {
  async execute({ item_id }: ItemProps) {
    try {
      // 1. Verifica se o item realmente existe
      const itemExists = await prismaClient.item.findFirst({
        where: {
          id: item_id,
        },
      });

      if (!itemExists) {
        throw new Error("Item não encontrado.");
      }

      // 2. Deleta o item
      await prismaClient.item.delete({
        where: {
          id: item_id,
        },
      });

      return { message: "Item removido com sucesso." };
    } catch (err: any) {
      // Mantém a mensagem específica se for o erro de item não encontrado
      if (err.message === "Item não encontrado.") {
        throw new Error(err.message);
      }

      console.log(err);
      throw new Error("Falha ao remover o item do pedido.");
    }
  }
}

export { RemoveItemOrderService };