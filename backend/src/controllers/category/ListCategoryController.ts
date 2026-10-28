import { Request, Response } from "express";
import { ListCategoryService } from "../../services/category/ListCategoryService";

class ListCategoryController {
  async handle(_req: Request, res: Response) {
    // ✅ Mudança de nome para seguir o padrão
    const listCategoryService = new ListCategoryService();

    const categories = await listCategoryService.execute();

    res.status(200).json(categories);
  }
}

export { ListCategoryController };
