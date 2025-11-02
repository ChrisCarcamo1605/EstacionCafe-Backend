import { Router } from "express";
import * as userController from "../../controller/UserController";
import { verifyToken } from "../../infrastructure/security/authMiddleware";
import { authorize } from "../../infrastructure/security/rbacMiddleware";

export const userRouter = Router();

// Rutas públicas (sin protección)
userRouter.post("/users/login", userController.login);

// Rutas protegidas (requieren token)

userRouter.all("/users", verifyToken, authorize(["admin"]));
userRouter.get("/users", verifyToken, userController.getUsers);
userRouter.get(
  "/users/type/:typeId",
  verifyToken,
  userController.getUsersByType,
);
userRouter.get("/users/:id", verifyToken, userController.getUserById);
userRouter.post("/users", verifyToken, userController.saveUser);
userRouter.put("/users/:id", verifyToken, userController.updateUser);
userRouter.delete("/users/:id", verifyToken, userController.deleteUser);
