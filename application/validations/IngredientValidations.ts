import { z } from "zod";

export const IngredientSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(255, "El nombre no puede exceder 255 caracteres")
    .trim(),

  quantity: z.number().nonnegative("La cantidad no puede ser negativa"),

  productId: z
    .number()
    .int("El ID del producto debe ser un número entero")
    .nonnegative("El ID del producto no puede ser negativo"),
  consumableId: z
    .number()
    .int("El ID del consumible debe ser un número entero")
    .nonnegative("El ID del consumible no puede ser negativo"),
});
