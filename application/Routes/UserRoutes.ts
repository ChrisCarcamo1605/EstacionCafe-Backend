import { Router } from 'express';
import {
    getUsers,
    getUserById,
    saveUser,
    updateUser,
    deleteUser,
    getUsersByType
} from '../../controller/UserController';

export const userRouter = Router();

userRouter.get('/users', getUsers);
userRouter.get('/users/type/:typeId', getUsersByType);
userRouter.get('/users/:id', getUserById);
userRouter.post('/users', saveUser);
userRouter.put('/users/:id', updateUser);
userRouter.delete('/users/:id', deleteUser);