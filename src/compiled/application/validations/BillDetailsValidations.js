"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillDetailsSchema = void 0;
const zod_1 = require("zod");
const billDetailsSchema = zod_1.z.object({
    producId: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0, "El ID del producto debe ser un número positivo"),
    quantity: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0, "El ID debe ser un número positivo"),
    subTotal: zod_1.z
        .string()
        .transform((val) => parseFloat(val))
        .refine((val) => !isNaN(val) && val > 0, "El total debe ser mayor a 0"),
});
exports.BillDetailsSchema = zod_1.z.object({
    cashRegister: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0, "Ingrese un ID de cajero valido o existente"),
    customer: zod_1.z
        .string()
        .max(25, "El nombre del cliente no puede ser mayor a 25 caracteres")
        .trim(),
    date: zod_1.z
        .string()
        .min(1, "La fecha es requerida")
        .refine((date) => !isNaN(Date.parse(date))),
    billDetails: zod_1.z.array(billDetailsSchema).nonempty(),
});
