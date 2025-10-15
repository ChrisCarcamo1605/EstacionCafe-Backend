import { z } from "zod";
import { CashRegister } from "../../core/entities/CashRegister";

const billDetailsSchema = z.object({
  producId: z
    .string()
    .transform((val) => parseInt(val))
    .refine(
      (val) => !isNaN(val) && val > 0,
      "El ID del producto debe ser un número positivo"
    ),
  quantity: z
    .string()
    .transform((val) => parseInt(val))
    .refine(
      (val) => !isNaN(val) && val > 0,
      "El ID debe ser un número positivo"
    ),
  subTotal: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 0, "El total debe ser mayor a 0"),
});

export const BillDetailsSchema = z.object({
  cashRegister: z
    .string()
    .transform((val) => parseInt(val))
    .refine(
      (val) => !isNaN(val) && val > 0,
      "Ingrese un ID de cajero valido o existente"
    ),
  customer: z
    .string()
    .max(25, "El nombre del cliente no puede ser mayor a 25 caracteres")
    .trim(),

  date: z
    .string()
    .min(1, "La fecha es requerida")
    .refine((date) => !isNaN(Date.parse(date))),

  billDetails: z.array(billDetailsSchema).nonempty(),
});
