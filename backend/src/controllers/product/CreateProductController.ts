// Importa os tipos Request e Response do Express.
// Request = o que chega (body, params, query, headers, file...).
// Response = o que sai (status, json, send...).
import { Request, Response } from "express";

// Importa o service que contém a lógica de negócio (validar categoria,
// subir imagem, criar produto). O controller NÃO faz nada disso — ele só delega.
import { CreateProductService } from "../../services/product/CreateProductService";

class CreateProductController {
  // `handle` é o padrão do projeto para o método principal dos controllers.
  // Recebe a requisição e devolve a resposta.
  async handle(req: Request, res: Response) {
    // ============================================================
    // 1. EXTRAIR OS CAMPOS DE TEXTO DO CORPO DA REQUISIÇÃO
    // ============================================================
    // Como estamos usando multipart/form-data (por causa da imagem),
    // TODOS esses campos chegam como STRING, mesmo o `price`.
    // Por isso depois fazemos `Number(price)` para converter.
    const { name, price, description, category_id } = req.body;

    // ============================================================
    // 2. VALIDAR SE O ARQUIVO FOI ENVIADO
    // ============================================================
    // O multer só popula `req.file` se um arquivo foi enviado no campo "file".
    // Se o usuário mandou a requisição sem imagem, precisamos avisar.
    // Essa validação aqui evita um erro mais confuso lá no service.
    if (!req.file) {
      throw new Error("A imagem do produto é obrigatória");
    }

    // ============================================================
    // 3. INSTANCIAR O SERVICE
    // ============================================================
    // Padrão do projeto: cada service é instanciado com `new` e usado via `execute`.
    const createProduct = new CreateProductService();

    // ============================================================
    // 4. CHAMAR O EXECUTE PASSANDO OS DADOS
    // ============================================================
    // O `execute` espera um objeto com exatamente os campos da interface
    // `CreateProductServiceProps`. Aqui adaptamos o que veio da requisição
    // para o formato que o service espera.
    const product = await createProduct.execute({
      name: name,

      // Number: converte a string "3500" (que veio do multipart) para
      // o número 3500. Preferível ao parseInt porque não corta decimais,
      // caso o valor chegue como "35.99" por engano.
      // Lembrando que no projeto o preço é armazenado em CENTAVOS (inteiro).
      price: Number(price),

      description: description,
      category_id: category_id,

      // req.file.buffer = os bytes brutos da imagem (memoryStorage do multer).
      imageBuffer: req.file.buffer,

      // req.file.originalname = o nome original do arquivo (ex: "pizza.jpg").
      // Usado para gerar o public_id único no Cloudinary.
      imageName: req.file.originalname,
    });

    // ============================================================
    // 5. DEVOLVER A RESPOSTA
    // ============================================================
    // Status 201 = Created. Usamos 201 (e não 200) porque um novo
    // recurso foi criado com sucesso. É o padrão REST para POST que cria algo.
    // O `return` deixa explícito que a função termina aqui.
    return res.status(201).json(product);
  }
}

export { CreateProductController };
