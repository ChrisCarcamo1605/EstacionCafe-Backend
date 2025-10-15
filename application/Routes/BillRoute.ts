import { Router } from 'express';
import {getBills,saveBill} from '../../controller/BillController';

export const billRouter = Router();
 
billRouter.get('/bills', getBills);
billRouter.post('/bills', saveBill);