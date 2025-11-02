import {
  saveDetails,
  getDetails,
  deleteDetail,
} from "../../controller/BillDetailsController";
import { Router } from "express";
import { authorize } from "../../infrastructure/security/rbacMiddleware";
import { verifyToken } from "../../infrastructure/security/authMiddleware";

export const billDetailsRouter = Router();

billDetailsRouter.all("/bill-details", verifyToken,authorize(['admin','mesero','cajero']) );
billDetailsRouter.post("/bill-details", saveDetails);
billDetailsRouter.get("/bill-details", getDetails);
billDetailsRouter.delete("/bill-details/:id", deleteDetail);
