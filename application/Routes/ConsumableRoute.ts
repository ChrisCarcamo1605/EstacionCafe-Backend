import { Router } from "express";
import * as ConsumableController from "../../controller/ConsumableController";


export const consumableRouter =  Router();

console.log("dentro del cons router")
consumableRouter.post("/consumable",ConsumableController.saveConsumable);
consumableRouter.get("/consumable", ConsumableController.getConsumables);