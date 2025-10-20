import { Router } from "express";
import {
    getConsumableTypes,
    getConsumableTypeById,
    saveConsumableType,
    updateConsumableType,
    deleteConsumableType
} from "../../controller/ConsumableTypeController";

export const consumableTypeRouter = Router();

consumableTypeRouter.get("/consumable-type", getConsumableTypes);
consumableTypeRouter.get("/consumable-type/:id", getConsumableTypeById);
consumableTypeRouter.post("/consumable-type", saveConsumableType);
consumableTypeRouter.put("/consumable-type/:id", updateConsumableType);
consumableTypeRouter.delete("/consumable-type/:id", deleteConsumableType);