import { Request, Response } from "express";
import { ListProductService } from "../../services/product/ListProductService";

class ListProductController {
  async handle(req: Request, res: Response) {
    // O middleware validateSchema já converteu o query param
    // para boolean e o colocou em req.query.disabled.
    const { disabled } = req.query;

    const listProductService = new ListProductService();

    const products = await listProductService.execute({
      disabled: disabled as unknown as boolean,
    });

    return res.json(products);
  }
}

export { ListProductController };
