import { z } from 'zod';

// Esquema para crear caja registradora
export const createCashRegisterSchema = z.object({
    number: z.string()
        .min(1, "El número de caja es requerido")
        .max(50, "El número de caja es muy largo")
        .trim(),

    active: z.boolean().optional().default(true)
});

// Esquema para actualizar caja registradora
export const updateCashRegisterSchema = z.object({
    number: z.string()
        .min(1, "El número de caja es requerido")
        .max(50, "El número de caja es muy largo")
        .trim()
        .optional(),

    active: z.boolean().optional()
});

// Esquema para ID
export const cashRegisterIdSchema = z.object({
    id: z.coerce.number()
        .int("El ID debe ser un número entero")
        .positive("El ID debe ser un número positivo")
});