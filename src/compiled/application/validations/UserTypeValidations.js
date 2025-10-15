"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTypeSchema = void 0;
const zod_1 = require("zod");
exports.UserTypeSchema = zod_1.z.object({
    name: zod_1.z.string().max(50).min(4).trim(),
    permissionLevel: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .refine((val) => !isNaN(val) && val >= 0),
});
