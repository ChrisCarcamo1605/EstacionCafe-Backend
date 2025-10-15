"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientSchema = void 0;
const zod_1 = require("zod");
exports.IngredientSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "El nombre es requerido")
        .max(255, "El nombre no puede exceder 255 caracteres")
        .trim(),
    quantity: zod_1.z.number().nonnegative("La cantidad no puede ser negativa"),
    productId: zod_1.z
        .number()
        .int("El ID del producto debe ser un número entero")
        .nonnegative("El ID del producto no puede ser negativo"),
    consumableId: zod_1.z
        .number()
        .int("El ID del consumible debe ser un número entero")
        .nonnegative("El ID del consumible no puede ser negativo"),
});
