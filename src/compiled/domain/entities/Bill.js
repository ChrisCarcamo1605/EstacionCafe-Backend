"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bill = void 0;
const typeorm_1 = require("typeorm");
const BillDetails_1 = require("./BillDetails");
let Bill = class Bill {
    constructor() {
        this.billId = undefined;
        this.cashRegister = undefined;
        this.customer = "";
        this.date = new Date();
        this.total = 0;
    }
};
exports.Bill = Bill;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment", { name: "bill_id" }),
    __metadata("design:type", Number)
], Bill.prototype, "billId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "cash_register" }),
    __metadata("design:type", Number)
], Bill.prototype, "cashRegister", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bill.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Bill.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { name: "total", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Bill.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => BillDetails_1.BillDetails, (billDet) => billDet.bill),
    __metadata("design:type", Array)
], Bill.prototype, "billDetails", void 0);
exports.Bill = Bill = __decorate([
    (0, typeorm_1.Entity)("bills")
], Bill);
