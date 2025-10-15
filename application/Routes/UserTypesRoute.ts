import { Router } from "express";
import * as UserTypeController from "../../controller/UserTypeController"

export const userTypeRoute = Router();

userTypeRoute.get("/users/type",UserTypeController.getTypes);
userTypeRoute.post("/users/type",UserTypeController.saveType);