import { Router } from 'express';
import {
    getBills,
    getBillById,
    saveBill,
    updateBill,
    deleteBill,
    getBillsByDateRange,
    getBillsByCustomer
} from '../../controller/BillController';

export const billRouter = Router();
 
billRouter.get('/bills', getBills);
billRouter.get('/bills/customer/:customer', getBillsByCustomer);
billRouter.get('/bills/date-range', getBillsByDateRange);
billRouter.get('/bills/:id', getBillById);
billRouter.post('/bills', saveBill);
billRouter.put('/bills/:id', updateBill);
billRouter.delete('/bills/:id', deleteBill);