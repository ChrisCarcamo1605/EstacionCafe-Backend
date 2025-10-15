import { Router } from "express";
import * as ConsumableTypeController from "../../controller/ConsumableTypeController";

export const consumableTypeRouter = Router();

console.log("dentro del consumableType router");
consumableTypeRouter.post("/consumable-type", ConsumableTypeController.saveConsumableType);
consumableTypeRouter.get("/consumable-type", ConsumableTypeController.getConsumableTypes);