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
exports.BillService = void 0;
const Bill_1 = require("../../core/entities/Bill");
class BillService {
    constructor(billRepository) {
        this.billRepository = billRepository;
        this.billRepository = billRepository;
    }
    saveAll(body) {
        throw new Error("Method not implemented.");
    }
    save(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = body;
            const bill = new Bill_1.Bill();
            bill.cashRegister = data.cashRegister;
            bill.total = data.total;
            bill.customer = data.customer;
            bill.date = data.date;
            console.log("Guardando factura...");
            return yield this.billRepository.save(bill);
        });
    }
    delete(id) {
        throw new Error("Method not implemented.");
    }
    update(body) {
        throw new Error("Method not implemented.");
    }
    getAll() {
        console.log(`Obteniendo facturas...`);
        return this.billRepository.find();
    }
}
exports.BillService = BillService;
