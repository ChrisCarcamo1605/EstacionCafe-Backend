import { Router } from 'express';
import {
    getCashRegisters,
    getCashRegisterById,
    saveCashRegister,
    updateCashRegister,
    deleteCashRegister,
    getActiveCashRegisters,
    getCashRegisterByNumber
} from '../../controller/CashRegisterController';

export const cashRegisterRouter = Router();

cashRegisterRouter.get('/cash-registers', getCashRegisters);
cashRegisterRouter.get('/cash-registers/active', getActiveCashRegisters);
cashRegisterRouter.get('/cash-registers/number/:number', getCashRegisterByNumber);
cashRegisterRouter.get('/cash-registers/:id', getCashRegisterById);
cashRegisterRouter.post('/cash-registers', saveCashRegister);
cashRegisterRouter.put('/cash-registers/:id', updateCashRegister);
cashRegisterRouter.delete('/cash-registers/:id', deleteCashRegister);