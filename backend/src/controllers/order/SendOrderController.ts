import { Request, Response } from "express";
import { SendOrderService } from "../../services/order/SendOrderService";

class SendOrderController {
  async handle(req: Request, res: Response) {
    const { order_id } = req.query;

    const sendOrderService = new SendOrderService();

    const order = await sendOrderService.execute({
      order_id: order_id as string,
    });

    return res.json(order);
  }
}

export { SendOrderController };