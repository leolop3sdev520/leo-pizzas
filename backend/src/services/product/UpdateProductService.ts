import { Readable } from "node:stream";
import cloudinary from "../../config/cloudinary";
import prismaClient from "../../prisma/index";

interface UpdateProductServiceProps {
  id: string;
  name: string;
  price: number;
  description: string;
  category_id: string;
  disabled: boolean; // Recebe se deve desativar ou ativar
  imageBuffer?: Buffer;
  imageName?: string;
}

class UpdateProductService {
  async execute({
    id,
    name,
    price,
    description,
    category_id,
    disabled,
    imageBuffer,
    imageName,
  }: UpdateProductServiceProps) {
    try {
      const productExists = await prismaClient.product.findFirst({
        where: { id },
      });
      if (!productExists) throw new Error("Produto não encontrado.");

      const categoryExists = await prismaClient.category.findFirst({
        where: { id: category_id },
      });
      if (!categoryExists) throw new Error("Categoria não encontrada.");

      let bannerUrl = productExists.banner;

      // Se uma nova imagem foi enviada, faz o upload para o Cloudinary
      if (imageBuffer && imageName) {
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "products",
              resource_type: "image",
              public_id: `${Date.now()}-${imageName.split(".")[0]}`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          );
          const bufferStream = Readable.from(imageBuffer);
          bufferStream.pipe(uploadStream);
        });
        bannerUrl = result.secure_url;
      }

      // Atualiza o produto no banco
      const product = await prismaClient.product.update({
        where: { id },
        data: {
          name,
          price,
          description,
          category_id,
          disabled, // ✅ Atualiza o status (retira ou coloca no cardápio)
          banner: bannerUrl,
        },
      });

      return product;
    } catch (err: any) {
      console.log("ERRO AO ATUALIZAR PRODUTO:", err.message);
      throw new Error(err.message || "Falha ao atualizar o produto.");
    }
  }
}

export { UpdateProductService };
