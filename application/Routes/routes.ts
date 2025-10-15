import express from 'express';
import {billRouter} from './BillRoute';
import {productRouter} from './ProductRoute';
import { billDetailsRouter } from './BillDetailsRoute';
import { userRoute } from './UserRoutes';
import { userTypeRoute } from './UserTypesRoute';

const mainRouter = express.Router();

// Usar las rutas de facturas
mainRouter.use('/', billRouter);
mainRouter.use('/', productRouter);
mainRouter.use('/',billDetailsRouter);
mainRouter.use('/',userRoute);
mainRouter.use('/',userTypeRoute);

export default mainRouter;