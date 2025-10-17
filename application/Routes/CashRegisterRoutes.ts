import { Router } from 'express';
import {
    getCashRegisters,
    getCashRegisterById,
    createCashRegister,
    updateCashRegister,
    deleteCashRegister,
    getActiveCashRegisters,
    getCashRegistersByNumber
} from '../../controller/CashRegisterController';

export const cashRegisterRouter = Router();

cashRegisterRouter.get('/cash-registers', getCashRegisters);
cashRegisterRouter.get('/cash-registers/active', getActiveCashRegisters);
cashRegisterRouter.get('/cash-registers/number/:number', getCashRegistersByNumber);
cashRegisterRouter.get('/cash-registers/:id', getCashRegisterById);
cashRegisterRouter.post('/cash-registers', createCashRegister);
cashRegisterRouter.put('/cash-registers/:id', updateCashRegister);
cashRegisterRouter.delete('/cash-registers/:id', deleteCashRegister);