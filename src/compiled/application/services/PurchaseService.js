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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseService = void 0;
const typeorm_1 = require("typeorm");
const Purchase_1 = require("../../core/entities/Purchase");
class PurchaseService {
    constructor(purchaseRepository) {
        this.purchaseRepository = purchaseRepository;
        this.purchaseRepository = purchaseRepository;
    }
    save(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = body;
            const purchase = new Purchase_1.Purchase();
            purchase.date = data.date;
            purchase.cashRegister = data.cashRegister;
            purchase.supplierId = data.supplierId;
            purchase.total = data.total;
            return yield this.purchaseRepository.save(purchase);
        });
    }
    saveAll(body) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Guardando múltiples compras...");
            return yield this.purchaseRepository.save(body);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.purchaseRepository.delete(id);
            if (result.affected === 0) {
                throw new Error(`Compra con ID ${id} no encontrada`);
            }
            return { message: "Compra eliminada correctamente", id };
        });
    }
    update(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { purchaseId } = body, updateData = __rest(body, ["purchaseId"]);
            if (!purchaseId) {
                throw new Error("purchaseId es requerido para actualizar");
            }
            const purchase = yield this.purchaseRepository.findOne({ where: { purchaseId } });
            if (!purchase) {
                throw new Error(`Compra con ID ${purchaseId} no encontrada`);
            }
            Object.assign(purchase, updateData);
            return yield this.purchaseRepository.save(purchase);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.purchaseRepository.find({
                relations: ["supplier"],
                order: { date: "DESC" }
            });
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const purchase = yield this.purchaseRepository.findOne({
                where: { purchaseId: id },
                relations: ["supplier"]
            });
            if (!purchase) {
                throw new Error(`Compra con ID ${id} no encontrada`);
            }
            return purchase;
        });
    }
    getBySupplier(supplierId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.purchaseRepository.find({
                where: { supplierId },
                relations: ["supplier"],
                order: { date: "DESC" }
            });
        });
    }
    getByDateRange(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.purchaseRepository.find({
                where: {
                    date: (0, typeorm_1.Between)(startDate, endDate)
                },
                relations: ["supplier"],
                order: { date: "DESC" }
            });
        });
    }
}
exports.PurchaseService = PurchaseService;
