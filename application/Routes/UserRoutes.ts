import { Router } from 'express';
import 
    * as userController
from '../../controller/UserController';

export const userRouter = Router();

userRouter.get('/users', userController.getUsers);
userRouter.get('/users/type/:typeId', userController.getUsersByType);
userRouter.get('/users/:id', userController.getUserById);
userRouter.post('/users', userController.saveUser);
userRouter.put('/users/:id', userController.updateUser);
userRouter.delete('/users/:id', userController.deleteUser);
userRouter.post('/users/login',userController.login)