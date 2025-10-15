"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BillRoute_1 = require("./BillRoute");
const ProductRoute_1 = require("./ProductRoute");
const BillDetailsRoute_1 = require("./BillDetailsRoute");
const UserRoutes_1 = require("./UserRoutes");
const UserTypesRoute_1 = require("./UserTypesRoute");
const ConsumableRoute_1 = require("./ConsumableRoute");
const ConsumableTypeRoute_1 = require("./ConsumableTypeRoute");
const mainRouter = express_1.default.Router();
console.log("dentro del  router");
// Usar las rutas de facturas
mainRouter.use("/", BillRoute_1.billRouter);
mainRouter.use("/", ProductRoute_1.productRouter);
mainRouter.use("/", BillDetailsRoute_1.billDetailsRouter);
mainRouter.use("/", UserRoutes_1.userRoute);
mainRouter.use("/", UserTypesRoute_1.userTypeRoute);
mainRouter.use("/", ConsumableRoute_1.consumableRouter);
mainRouter.use("/", ConsumableTypeRoute_1.consumableTypeRouter);
exports.default = mainRouter;
