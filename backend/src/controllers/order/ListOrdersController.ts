import { Request, Response } from "express";
import { ListOrdersService } from "../../services/order/ListOrdersService.js";

class ListOrdersController {
  async handle(req: Request, res: Response) {
    const { draft, view } = req.query;
    const service = new ListOrdersService();
    const orders = await service.execute({
      draft: draft as string,
      view: view as string,
    });
    return res.json(orders);
  }
}
export { ListOrdersController };
