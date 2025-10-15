import { z } from "zod";
import { UnitMeasurement } from "../../core/enums/UnitMeasurement";

export const ConsumableSchema = z.object({
  supplierId: z
    .number()
    .int("El ID del proveedor debe ser un número entero")
    .positive("El ID del proveedor debe ser un número positivo"),

  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(255, "El nombre no puede exceder 255 caracteres")
    .trim(),

  cosumableTypeId: z
    .number()
    .int("El ID del tipo de consumible debe ser un número entero")
    .nonnegative("El ID del tipo de consumible no puede ser negativo"),

  quantity: z.number().nonnegative("La cantidad no puede ser negativa"),

  unitMeasurement: z.enum(UnitMeasurement),

  cost: z
    .number()
    .nonnegative("El costo no puede ser negativo")
    .multipleOf(0.01, "El costo debe tener máximo 2 decimales"),
});

export const ConsumableTypeSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(255, "El nombre no puede exceder 255 caracteres")
    .trim(),
});

export type ConsumableInput = z.infer<typeof ConsumableSchema>;
