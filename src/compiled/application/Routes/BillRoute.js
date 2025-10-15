"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billRouter = void 0;
const express_1 = require("express");
const BillController_1 = require("../../controller/BillController");
exports.billRouter = (0, express_1.Router)();
exports.billRouter.get('/bills', BillController_1.getBills);
exports.billRouter.post('/bills', BillController_1.saveBill);
