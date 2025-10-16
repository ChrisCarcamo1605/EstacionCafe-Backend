import express from "express";
import { billRouter } from "./BillRoute";
import { productRouter } from "./ProductRoute";
import { billDetailsRouter } from "./BillDetailsRoute";
import { userRoute } from "./UserRoutes";
import { userTypeRoute } from "./UserTypesRoute";
import { consumableRouter } from "./ConsumableRoute";
import { consumableTypeRouter } from "./ConsumableTypeRoute";
import { supplierRouter } from "./SupplierRoute";
import { ingredientRouter } from "./IngredientRoute";


const mainRouter = express.Router();

// Usar las rutas de facturas
mainRouter.use("/", billRouter);
mainRouter.use("/", productRouter);
mainRouter.use("/", billDetailsRouter);
mainRouter.use("/", userRoute);
mainRouter.use("/", userTypeRoute);
mainRouter.use("/", consumableRouter);
mainRouter.use("/", consumableTypeRouter);
mainRouter.use("/", supplierRouter);
mainRouter.use("/",ingredientRouter)

export default mainRouter;
