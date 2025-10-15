import { email, z } from "zod";

export const userSchema = z.object({
  username: z.string().max(25).min(5).trim(),
  password: z
    .string("El password es de tipo string no number")
    .min(8)
    .max(50)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
    ),
  typeId: z
    .string()
    .transform((val) => parseInt(val))
    .refine(
      (val) => !isNaN(val) && val > 0,
      "Ingrese un id de UserTypeId valido"
    ),
  email: z
    .email("Ingrese un email válido")
    .max(100, "El email no puede exceder 100 caracteres")
    .trim(),
});
