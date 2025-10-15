import { z } from "zod";

const ConsumableTypeSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(255, "El nombre no puede exceder 255 caracteres")
    .trim(),
});
