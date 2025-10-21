import { Router } from 'express';
import {
    getProducts,
    getProductById,
    saveProduct,
    updateProduct,
    deleteProduct,
    getActiveProducts
} from '../../controller/ProductController';

export const productRouter = Router();

productRouter.get("/products", getProducts);
productRouter.get("/products/active", getActiveProducts);
productRouter.get("/products/:id", getProductById);
productRouter.post("/products", saveProduct);
productRouter.put("/products/:id", updateProduct);
productRouter.delete("/products/:id", deleteProduct);