"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillDetailsService = void 0;
const BillDetails_1 = require("../../core/entities/BillDetails");
const Bill_1 = require("../../core/entities/Bill");
class BillDetailsService {
    constructor(detailRepo, billService) {
        this.detailRepo = detailRepo;
        this.billService = billService;
        this.detailRepo = detailRepo;
        this.billService = billService;
    }
    save(body) {
        throw new Error("Method not implemented.");
    }
    saveAll(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const details = [];
            const data = body;
            const bill = new Bill_1.Bill();
            bill.cashRegister = data.cashRegister;
            bill.customer = data.customer;
            bill.date = data.date;
            bill.total = data.billDetails.reduce((acc, val) => acc + val.subTotal, 0);
            console.log("Guardando factura...");
            const billResult = yield this.billService.save(bill);
            data.billDetails.forEach((detail) => {
                const newDetail = new BillDetails_1.BillDetails();
                newDetail.billId = billResult.billId;
                newDetail.productId = detail.productId;
                newDetail.quantity = detail.quantity;
                newDetail.subTotal = detail.subTotal;
                details.push(newDetail);
            });
            console.log("Guardando detalles de la factura...");
            return this.detailRepo.save(details);
        });
    }
    delete(id) {
        throw new Error("Method not implemented.");
    }
    update(body) {
        throw new Error("Method not implemented.");
    }
    getAll() {
        console.log(`Obteniendo bills details...`);
        return this.detailRepo.find({
            relations: ["product", "bill"],
        });
    }
}
exports.BillDetailsService = BillDetailsService;
