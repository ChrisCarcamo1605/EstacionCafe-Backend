"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purchase = void 0;
class Purchase {
    constructor(purchaseId, date, supplier, cashRegister, total) {
        this.purchaseId = purchaseId;
        this.date = date;
        this.cashRegister = cashRegister;
        this.supplier = supplier;
        this.total = total;
    }
}
exports.Purchase = Purchase;
