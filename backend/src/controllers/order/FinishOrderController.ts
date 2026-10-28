import { Request, Response } from "express";
import { FinishOrderService } from "../../services/order/FinishOrderService";

class FinishOrderController {
  async handle(req: Request, res: Response) {
    const { order_id } = req.query;

    const finishOrderService = new FinishOrderService();

    const order = await finishOrderService.execute({
      order_id: order_id as string,
    });

    return res.json(order);
  }
}

export { FinishOrderController };