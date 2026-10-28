import { Request, Response } from "express";
import { DeleteOrderService } from "../../services/order/DeleteOrderService.js"; // Lembre do .js aqui também

class DeleteOrderController {
  async handle(req: Request, res: Response) {
    const { order_id } = req.query;

    const deleteOrderService = new DeleteOrderService();
    const result = await deleteOrderService.execute({
      order_id: order_id as string,
    });

    return res.json(result);
  }
}

export { DeleteOrderController };
