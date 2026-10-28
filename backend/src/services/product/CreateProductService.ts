// Importa a classe Readable do módulo nativo de streams do Node.js.
// Usamos ela para transformar um Buffer (bytes da imagem) em um stream legível,
// que é o formato que o Cloudinary espera receber.
import { Readable } from "node:stream";

// Importa a instância já configurada do Cloudinary (feita em src/config/cloudinary.ts).
import cloudinary from "../../config/cloudinary";

// Importa o Prisma Client para comunicar com o banco de dados.
import prismaClient from "../../prisma/index";

// Interface que define o CONTRATO do que esse service espera receber.
interface CreateProductServiceProps {
  name: string; // Nome do produto
  price: number; // Preço em centavos (int)
  description: string; // Descrição do produto
  category_id: string; // ID da categoria (relação)
  imageBuffer: Buffer; // Bytes da imagem (vem do multer memoryStorage)
  imageName: string; // Nome original do arquivo (ex: "pizza.jpg")
}

class CreateProductService {
  // Recebe os dados via destructuring e tipa com a interface acima.
  async execute({
    name,
    price,
    description,
    category_id,
    imageBuffer,
    imageName,
  }: CreateProductServiceProps) {
    // ============================================================
    // ETAPA 1: VALIDAR REGRA DE NEGÓCIO (categoria existe?)
    // ============================================================
    // A validação do TIPO do arquivo já foi feita pelo fileFilter do multer.
    // Aqui só validamos se a categoria informada existe no banco.
    const categoryExists = await prismaClient.category.findFirst({
      where: {
        id: category_id,
      },
    });

    if (!categoryExists) {
      throw new Error("Categoria não encontrada!");
    }

    // ============================================================
    // ETAPA 2: FAZER UPLOAD DA IMAGEM PARA O CLOUDINARY
    // ============================================================
    // Variável que vai receber a URL da imagem depois do upload.
    let bannerUrl = "";

    try {
      // Embrulhamos o upload numa Promise porque a API do Cloudinary
      // usa callback (não suporta await direto). Assim conseguimos usar `await`.
      const result = await new Promise<any>((resolve, reject) => {
        // Cria o "cano" (stream) que vai enviar os bytes para o Cloudinary.
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "products", // Pasta onde a imagem será salva
            resource_type: "image", // Tipo de recurso
            // public_id = nome único da imagem no Cloudinary.
            // Date.now() evita nomes duplicados; split(".")[0] remove a extensão.
            public_id: `${Date.now()}-${imageName.split(".")[0]}`,
          },
          // Callback chamado quando o upload termina (sucesso ou erro).
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        // Transforma o Buffer (bytes da imagem) em um stream legível.
        const bufferStream = Readable.from(imageBuffer);

        // Faz o "encanamento": os bytes que saem do bufferStream
        // entram no uploadStream (que vai para o Cloudinary).
        bufferStream.pipe(uploadStream);
      });

      // URL HTTPS pública da imagem no Cloudinary.
      bannerUrl = result.secure_url;
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao fazer o upload da imagem!");
    }

    // ============================================================
    // ETAPA 3: CRIAR O PRODUTO NO BANCO DE DADOS
    // ============================================================
    const product = await prismaClient.product.create({
      data: {
        name: name,
        price: price,
        description: description,
        banner: bannerUrl, // URL vinda do Cloudinary
        category_id: category_id,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        category_id: true,
        banner: true,
        createdAt: true,
      },
    });

    return product;
  }
}

export { CreateProductService };
