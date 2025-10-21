import { z } from "zod";

export const createBillSchema = z.object({
  cashRegister: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine(
      (val) => !isNaN(val) && val > 0,
      "La caja registradora debe ser un número positivo0"
    ),

  total: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 0, "El total debe ser mayor a 0"),

  customer: z
    .string()
    .min(1, "El nombre del cliente es requerido")
    .max(100, "El nombre del cliente es muy largo")
    .trim(),

  date: z
    .string()
    .min(1, "La fecha es requerida")
    .transform((str) => new Date(str))
    .refine((date) => !isNaN(date.getTime()), "La fecha debe ser válida")
    .refine((date) => date <= new Date(), "La fecha no puede ser futura"),
});

export const updateBillSchema = z.object({
  cashRegisterId: z
    .number()
    .int("La caja registradora debe ser un número entero")
    .positive("La caja registradora debe ser un número positivo")
,
  total: z
    .number()
    .positive("El total debe ser mayor a 0")
    .refine(
      (val) => Number((val % 0.01).toFixed(2)) === 0,
      "El total debe tener máximo 2 decimales"
    )
,
  customer: z
    .string()
    .min(1, "El nombre del cliente es requerido")
    .max(100, "El nombre del cliente es muy largo")
    .trim(),
  date: z
    .date()
    .or(z.string().transform((str) => new Date(str)))
    .optional(),
});

export const billIdSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine(
      (val) => !isNaN(val) && val > 0,
      "El ID debe ser un número positivo"
    ),
});

export const billSchema = createBillSchema;
