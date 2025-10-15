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
exports.SupplierService = void 0;
const Supplier_1 = require("../../core/entities/Supplier");
class SupplierService {
    constructor(supplierRepository) {
        this.supplierRepository = supplierRepository;
        this.supplierRepository = supplierRepository;
    }
    save(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = body;
            const supplier = new Supplier_1.Supplier();
            supplier.name = data.name;
            supplier.phone = data.phone;
            supplier.email = data.email;
            supplier.active = data.active !== undefined ? data.active : true;
            console.log("Guardando proveedor...");
            return yield this.supplierRepository.save(supplier);
        });
    }
    saveAll(body) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Guardando múltiples proveedores...");
            return yield this.supplierRepository.save(body);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Eliminando proveedor con ID: ${id}`);
            const result = yield this.supplierRepository.delete(id);
            if (result.affected === 0) {
                throw new Error(`Proveedor con ID ${id} no encontrado`);
            }
            return { message: "Proveedor eliminado correctamente", id };
        });
    }
    update(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { supplierId } = body, updateData = __rest(body, ["supplierId"]);
            console.log(`Actualizando proveedor con ID: ${supplierId}`);
            const supplier = yield this.supplierRepository.findOne({ where: { supplierId } });
            if (!supplier) {
                throw new Error(`Proveedor con ID ${supplierId} no encontrado`);
            }
            Object.assign(supplier, updateData);
            return yield this.supplierRepository.save(supplier);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Obteniendo todos los proveedores...");
            return yield this.supplierRepository.find({
                order: { name: "ASC" }
            });
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Obteniendo proveedor con ID: ${id}`);
            const supplier = yield this.supplierRepository.findOne({ where: { supplierId: id } });
            if (!supplier) {
                throw new Error(`Proveedor con ID ${id} no encontrado`);
            }
            return supplier;
        });
    }
    getActiveSuppliers() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Obteniendo proveedores activos...");
            return yield this.supplierRepository.find({
                where: { active: true },
                order: { name: "ASC" }
            });
        });
    }
}
exports.SupplierService = SupplierService;
