import { Router } from 'express';
import * as productController from "../../controller/ProductController";

export const productRouter = Router();

productRouter.get("/products", productController.getProducts);
productRouter.post("/products", productController.saveProduct);