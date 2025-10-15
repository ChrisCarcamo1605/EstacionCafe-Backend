"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suppliersSchema = exports.billSchema = void 0;
const zod_1 = require("zod");
// 📝 Esquema para validar facturas (compatible con form-urlencoded)
exports.billSchema = zod_1.z.object({
    cashRegister: zod_1.z.string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => !isNaN(val) && val > 0, "La caja registradora debe ser un número positivo"),
    customer: zod_1.z.string()
        .min(1, "El nombre del cliente no puede estar vacío")
        .max(100, "El nombre del cliente es muy largo")
        .trim(),
    total: zod_1.z.string()
        .transform((val) => parseFloat(val))
        .refine((val) => !isNaN(val) && val > 0, "El total debe ser mayor a 0"),
    date: zod_1.z.string()
        .min(1, "La fecha es requerida")
        .refine((date) => !isNaN(Date.parse(date)))
        .transform((date) => new Date(date))
});
// 📝 Esquema para validar proveedores  
exports.suppliersSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(1, "El nombre no puede estar vacío")
        .max(50, "El nombre es muy largo")
        .trim(),
    phone: zod_1.z.string()
        .min(1, "El teléfono es requerido")
        .regex(/^(\+503)?[2-9]\d{3}-?\d{4}$/, "El teléfono debe tener formato válido (+503 XXXX-XXXX)")
        .transform((val) => val.replace(/\s|-/g, "")),
    email: zod_1.z.string()
        .min(1, "El email es requerido")
        .email("Debe ser un email válido")
        .toLowerCase(),
    address: zod_1.z.string()
        .min(1, "La dirección no puede estar vacía")
        .max(200, "La dirección es muy larga")
        .trim()
});
module.exports = { billSchema: exports.billSchema, suppliersSchema: exports.suppliersSchema };
