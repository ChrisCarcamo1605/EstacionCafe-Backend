import * as BillDetailsController from "../../controller/BillDetailsController";
import { Router } from "express";

export const billDetailsRouter = Router();

billDetailsRouter.post("/bills/details",BillDetailsController.saveDetails);
billDetailsRouter.get("/bills/details",BillDetailsController.getDetails);

