import * as IngredientController from "../../controller/IngredientController";
import { Router } from "express";

export const ingredientRouter = Router();

ingredientRouter.post("/ingredient", IngredientController.saveIngredient);
ingredientRouter.get("/ingredient", IngredientController.getIngredients);
