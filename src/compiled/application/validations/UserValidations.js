"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    username: zod_1.z.string().max(25).min(5).trim(),
    password: zod_1.z
        .string("El password es de tipo string no number")
        .min(8)
        .max(50)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"),
    typeId: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0, "Ingrese un id de UserTypeId valido"),
    email: zod_1.z
        .email("Ingrese un email válido")
        .max(100, "El email no puede exceder 100 caracteres")
        .trim(),
});
