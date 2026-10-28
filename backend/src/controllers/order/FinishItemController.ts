import { Request, Response } from "express";
import { FinishItemService } from "../../services/order/FinishItemService.js";

class FinishItemController {
  async handle(req: Request, res: Response) {
    const { item_id } = req.query;
    const service = new FinishItemService();
    const result = await service.execute({ item_id: item_id as string });
    return res.json(result);
  }
}
export { FinishItemController };
