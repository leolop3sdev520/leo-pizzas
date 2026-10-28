import prismaClient from "../../prisma/index";

interface DeleteProductServiceProps {
  product_id: string;
}

class DeleteProductService {
  async execute({ product_id }: DeleteProductServiceProps) {
    try {
      // Soft delete: ao invés de apagar, marca como desabilitado.
      // Assim mantemos o histórico e a integridade referencial.
      await prismaClient.product.update({
        where: {
          id: product_id,
        },
        data: {
          disabled: true,
        },
      });

      return { message: "Produto deletado/desabilitado com sucesso" };
    } catch (err) {
      console.log(err);
      throw new Error("Falha ao deletar/desabilitar o produto");
    }
  }
}

export { DeleteProductService };
