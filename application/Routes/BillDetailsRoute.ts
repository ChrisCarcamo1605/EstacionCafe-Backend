import {saveDetails,getDetails,deleteDetail}from "../../controller/BillDetailsController";
import { Router } from "express";

export const billDetailsRouter = Router();

billDetailsRouter.post("/bill-details",saveDetails);
billDetailsRouter.get("/bill-details",getDetails);
billDetailsRouter.delete("/bill-details/:id",deleteDetail);

