import { Router } from "express";
import multer from "multer";
import uploadConfig from "./config/multer.js";

import { CreateCategoryController } from "./controllers/category/CreateCategoryController.js";
import { ListCategoryController } from "./controllers/category/ListCategoryController.js";
import { DeleteCategoryController } from "./controllers/category/DeleteCategoryController.js";
import { CreateOrderController } from "./controllers/order/CreateOrderController.js";
import { ListOrdersController } from "./controllers/order/ListOrdersController.js";
import { AddItemController } from "./controllers/order/AddItemController.js";
import { RemoveItemController } from "./controllers/order/RemoveItemController.js";
import { SendOrderController } from "./controllers/order/SendOrderController.js";
import { FinishItemController } from "./controllers/order/FinishItemController.js";
import { DeleteOrderController } from "./controllers/order/DeleteOrderController.js";
import { CreateProductController } from "./controllers/product/CreateProductController.js";
import { ListProductController } from "./controllers/product/ListProductController.js";
import { DeleteProductController } from "./controllers/product/DeleteProductController.js";
import { UpdateProductController } from "./controllers/product/UpdateProductController.js";
import { AuthUserController } from "./controllers/user/AuthUserController.js";
import { CreateUserController } from "./controllers/user/CreateUserController.js";
import { DetailUserController } from "./controllers/user/DetailUserController.js";

import { isAdmin } from "./middlewares/isAdmin.js";
import { isAuthenticated } from "./middlewares/isAuthenticated.js";
import { validateSchema } from "./middlewares/validateSchema.js";

import { createCategorySchema } from "./schemas/categorySchema.js";
import { deleteProductSchema } from "./schemas/deleteProductSchema.js";
import { updateProductSchema } from "./schemas/updateProductSchema.js";
import { addItemSchema } from "./schemas/itemSchema.js";
import { listProductsSchema } from "./schemas/listProductSchema.js";
import { createOrderSchema } from "./schemas/orderSchema.js";
import { authUserSchema, createUserSchema } from "./schemas/userSchema.js";

const router = Router();
const upload = multer(uploadConfig);

// USERS
router.post(
  "/users",
  validateSchema(createUserSchema),
  new CreateUserController().handle,
);
router.post(
  "/session",
  validateSchema(authUserSchema),
  new AuthUserController().handle,
);
router.get("/me", isAuthenticated, new DetailUserController().handle);

// CATEGORIES
router.post(
  "/category",
  isAuthenticated,
  isAdmin,
  validateSchema(createCategorySchema),
  new CreateCategoryController().handle,
);
router.get("/category", isAuthenticated, new ListCategoryController().handle);
router.delete(
  "/category",
  isAuthenticated,
  isAdmin,
  new DeleteCategoryController().handle,
);

// PRODUCTS
router.post(
  "/product",
  isAuthenticated,
  isAdmin,
  upload.single("file"),
  new CreateProductController().handle,
);
router.get(
  "/products",
  isAuthenticated,
  validateSchema(listProductsSchema),
  new ListProductController().handle,
);
router.put(
  "/product",
  isAuthenticated,
  isAdmin,
  upload.single("file"),
  validateSchema(updateProductSchema),
  new UpdateProductController().handle,
);
router.delete(
  "/product",
  isAuthenticated,
  isAdmin,
  validateSchema(deleteProductSchema),
  new DeleteProductController().handle,
);

// ORDERS
router.post(
  "/order",
  isAuthenticated,
  validateSchema(createOrderSchema),
  new CreateOrderController().handle,
);
router.get("/orders", isAuthenticated, new ListOrdersController().handle); // Usada para as duas telas
router.post(
  "/order/add",
  isAuthenticated,
  validateSchema(addItemSchema),
  new AddItemController().handle,
);
router.delete(
  "/order/remove",
  isAuthenticated,
  new RemoveItemController().handle,
);
router.put("/order/send", isAuthenticated, new SendOrderController().handle); // Envia DRAFTs para PRODUCTION
router.put("/item/finish", isAuthenticated, new FinishItemController().handle); // Cozinha entrega item
router.delete("/order", isAuthenticated, new DeleteOrderController().handle); // Fecha a conta da mesa

export { router };
