import { Router } from "express";
import * as ConsumableController from "../../controller/ConsumableController";


export const consumableRouter =  Router();

consumableRouter.post("/consumable",ConsumableController.saveConsumable);
consumableRouter.get("/consumable", ConsumableController.getConsumables);