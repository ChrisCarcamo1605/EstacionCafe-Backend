"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumableTypeSchema = exports.ConsumableSchema = void 0;
const zod_1 = require("zod");
const UnitMeasurement_1 = require("../../core/enums/UnitMeasurement");
exports.ConsumableSchema = zod_1.z.object({
    supplierId: zod_1.z
        .number()
        .int("El ID del proveedor debe ser un número entero")
        .positive("El ID del proveedor debe ser un número positivo"),
    name: zod_1.z
        .string()
        .min(1, "El nombre es requerido")
        .max(255, "El nombre no puede exceder 255 caracteres")
        .trim(),
    cosumableTypeId: zod_1.z
        .number()
        .int("El ID del tipo de consumible debe ser un número entero")
        .nonnegative("El ID del tipo de consumible no puede ser negativo"),
    quantity: zod_1.z.number().nonnegative("La cantidad no puede ser negativa"),
    unitMeasurement: zod_1.z.enum(UnitMeasurement_1.UnitMeasurement),
    cost: zod_1.z
        .number()
        .nonnegative("El costo no puede ser negativo")
        .multipleOf(0.01, "El costo debe tener máximo 2 decimales"),
});
exports.ConsumableTypeSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "El nombre es requerido")
        .max(255, "El nombre no puede exceder 255 caracteres")
        .trim(),
});
