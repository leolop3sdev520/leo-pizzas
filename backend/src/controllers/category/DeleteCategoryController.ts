import { Request, Response } from "express";
import { DeleteCategoryService } from "../../services/category/DeleteCategoryService";

class DeleteCategoryController {
  async handle(req: Request, res: Response) {
    const { id } = req.query; // Recebe o ID via query param (?id=...)

    const deleteCategoryService = new DeleteCategoryService();

    await deleteCategoryService.execute(id as string);

    return res.json({ message: "Categoria desabilitada com sucesso" });
  }
}

export { DeleteCategoryController };
