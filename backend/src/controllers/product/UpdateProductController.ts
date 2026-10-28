import { Request, Response } from "express";
import { UpdateProductService } from "../../services/product/UpdateProductService";

class UpdateProductController {
  async handle(req: Request, res: Response) {
    const { id } = req.query; // ID do produto na URL
    const { name, price, description, category_id, disabled } = req.body;
    const file = req.file; // Arquivo opcional

    const updateProductService = new UpdateProductService();

    const product = await updateProductService.execute({
      id: id as string,
      name,
      price: Number(price),
      description,
      category_id,
      disabled: disabled === "true", // Converte a string "true" para boolean
      imageBuffer: file?.buffer,
      imageName: file?.originalname,
    });

    return res.json(product);
  }
}

export { UpdateProductController };
