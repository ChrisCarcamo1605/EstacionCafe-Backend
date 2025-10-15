import { z } from 'zod';

// 📝 Esquema para validar facturas (compatible con form-urlencoded)
export const billSchema = z.object({
    cashRegister: z.string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "La caja registradora debe ser un número positivo"),
    
    customer: z.string()
      .min(1, "El nombre del cliente no puede estar vacío")
      .max(100, "El nombre del cliente es muy largo")
      .trim(), 
    
    total: z.string()
      .transform((val) => parseFloat(val))
      .refine((val) => !isNaN(val) && val > 0, "El total debe ser mayor a 0"),
    
    date: z.string()
      .min(1, "La fecha es requerida")
      .refine(
        (date) => !isNaN(Date.parse(date)) 
      )
      .transform((date) => new Date(date))
});

// 📝 Esquema para validar proveedores  
export const suppliersSchema = z.object({
    name: z.string()
        .min(1, "El nombre no puede estar vacío")
        .max(50, "El nombre es muy largo")
        .trim(),
    
    phone: z.string()
        .min(1, "El teléfono es requerido")
        .regex(/^(\+503)?[2-9]\d{3}-?\d{4}$/, "El teléfono debe tener formato válido (+503 XXXX-XXXX)")
        .transform((val) => val.replace(/\s|-/g, "")),  
    
    email: z.string()
        .min(1, "El email es requerido")
        .email("Debe ser un email válido")
        .toLowerCase(),
    
    address: z.string()
        .min(1, "La dirección no puede estar vacía")
        .max(200, "La dirección es muy larga")
        .trim()
});

module.exports ={billSchema, suppliersSchema}