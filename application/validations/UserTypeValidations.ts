import { z } from "zod";

export const UserTypeSchema = z.object({
  name: z.string().max(50).min(4).trim(),
  permissionLevel: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val >= 0),
});
