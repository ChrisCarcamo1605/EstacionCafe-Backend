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
exports.ConsumableService = void 0;
const Consumable_1 = require("../../core/entities/Consumable");
class ConsumableService {
    constructor(consumableRepository) {
        this.consumableRepository = consumableRepository;
        this.consumableRepository = consumableRepository;
    }
    save(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const consumable = new Consumable_1.Consumable();
            consumable.supplierId = body.supplier;
            consumable.name = body.name;
            consumable.cosumableTypeId = body.TypeId;
            consumable.cost = body.cost;
            consumable.quantity = body.quantity;
            consumable.unitMeasurement = body.unitMeasurement;
            return yield this.consumableRepository.save(consumable);
        });
    }
    saveAll(consumables) {
        return __awaiter(this, void 0, void 0, function* () {
            const consumableEntities = consumables.map(body => {
                const consumable = new Consumable_1.Consumable();
                consumable.supplierId = body.supplier;
                consumable.name = body.name;
                consumable.cosumableTypeId = body.TypeId;
                consumable.cost = body.cost;
                consumable.quantity = body.quantity;
                consumable.unitMeasurement = body.unitMeasurement;
                return consumable;
            });
            return yield this.consumableRepository.save(consumableEntities);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.consumableRepository.delete(id);
            if (result.affected === 0) {
                throw new Error(`Consumible con ID ${id} no encontrado`);
            }
        });
    }
    update(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const consumable = yield this.consumableRepository.findOne({
                where: { consumableId: body.TypeId }
            });
            if (!consumable) {
                throw new Error(`Consumible con ID ${body.TypeId} no encontrado`);
            }
            if (body.supplier !== undefined)
                consumable.supplierId = body.supplier;
            if (body.name !== undefined)
                consumable.name = body.name;
            if (body.TypeId !== undefined)
                consumable.cosumableTypeId = body.TypeId;
            if (body.cost !== undefined)
                consumable.cost = body.cost;
            if (body.quantity !== undefined)
                consumable.quantity = body.quantity;
            if (body.unitMeasurement !== undefined)
                consumable.unitMeasurement = body.unitMeasurement;
            return yield this.consumableRepository.save(consumable);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.consumableRepository.find({
                relations: ['consumableType']
            });
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.consumableRepository.findOne({
                where: { consumableId: id },
                relations: ['consumableType']
            });
        });
    }
}
exports.ConsumableService = ConsumableService;
