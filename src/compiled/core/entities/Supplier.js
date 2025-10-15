"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Supplier = void 0;
class Supplier {
    constructor(supplierId, name, phone, email, active) {
        this.supplierId = supplierId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.active = active;
    }
}
exports.Supplier = Supplier;
