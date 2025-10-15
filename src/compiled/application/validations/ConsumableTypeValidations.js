"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const ConsumableTypeSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "El nombre es requerido")
        .max(255, "El nombre no puede exceder 255 caracteres")
        .trim(),
});
