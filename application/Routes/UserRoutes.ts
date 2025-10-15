import { Router } from "express";
import {getUsers,saveUser} from "../../controller/UserController"

export const userRoute = Router();

userRoute.get("/users",getUsers);
userRoute.post("/users",saveUser);