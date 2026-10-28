import { Request, Response } from "express";
import { CreateOrderService } from "../../services/order/CreateOrderService.js";

class CreateOrderController {
  async handle(req: Request, res: Response) {
    const { table, name } = req.body;
    const user_id = req.user_id; // ✅ Pega o ID do garçom

    const createOrderService = new CreateOrderService();
    const order = await createOrderService.execute({ table, name, user_id });

    return res.status(201).json(order);
  }
}

export { CreateOrderController };
