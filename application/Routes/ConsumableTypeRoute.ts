import { Router } from "express";
import * as ConsumableTypeController from "../../controller/ConsumableTypeController";

export const consumableTypeRouter = Router();

consumableTypeRouter.post("/consumable-type", ConsumableTypeController.saveConsumableType);
consumableTypeRouter.get("/consumable-type", ConsumableTypeController.getConsumableTypes);