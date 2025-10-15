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
exports.ConsumableTypeService = void 0;
const ConsumableType_1 = require("../../core/entities/ConsumableType");
class ConsumableTypeService {
    constructor(ConsumableTypeRepository) {
        this.ConsumableTypeRepository = ConsumableTypeRepository;
        this.ConsumableTypeRepository = ConsumableTypeRepository;
    }
    save(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const consumableType = new ConsumableType_1.ConsumableType();
            consumableType.name = body.name;
            return yield this.ConsumableTypeRepository.save(consumableType);
        });
    }
    saveAll(ConsumableTypes) {
        return __awaiter(this, void 0, void 0, function* () {
            const ConsumableTypeEntities = ConsumableTypes.map((body) => {
                const consumableType = new ConsumableType_1.ConsumableType();
                consumableType.name = body.name;
                return consumableType;
            });
            return yield this.ConsumableTypeRepository.save(ConsumableTypeEntities);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ConsumableTypeRepository.delete(id);
            if (result.affected === 0) {
                throw new Error(`Tipo de consumible con ID ${id} no encontrado`);
            }
        });
    }
    update(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const consumableType = yield this.ConsumableTypeRepository.findOne({
                where: { consumableTypeId: body.consumableTypeId },
            });
            if (!consumableType) {
                throw new Error(`Tipo de consumible con ID ${body.consumableTypeId} no encontrado`);
            }
            if (body.name !== undefined)
                consumableType.name = body.name;
            return yield this.ConsumableTypeRepository.save(consumableType);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ConsumableTypeRepository.find();
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ConsumableTypeRepository.findOne({
                where: { consumableTypeId: id },
            });
        });
    }
}
exports.ConsumableTypeService = ConsumableTypeService;
