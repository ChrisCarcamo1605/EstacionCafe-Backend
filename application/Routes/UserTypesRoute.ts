import { Router } from 'express';
import {
    getUserTypes,
    getUserTypeById,
    saveUserType,
    updateUserType,
    deleteUserType
} from '../../controller/UserTypeController';

export const userTypeRouter = Router();

userTypeRouter.get('/user-types', getUserTypes);
userTypeRouter.get('/user-types/:id', getUserTypeById);
userTypeRouter.post('/user-types', saveUserType);
userTypeRouter.put('/user-types/:id', updateUserType);
userTypeRouter.delete('/user-types/:id', deleteUserType);