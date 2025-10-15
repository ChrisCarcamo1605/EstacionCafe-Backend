import { Bill } from "../core/entities/Bill";
import { IService } from "../core/interfaces/IService";
import { billSchema } from "../application/validations/BillValidations";
import { SaveBillDTO, BillItemDTO } from "../application/DTOs/BillsDTO";

let service: IService;
export const setService = (billService: IService) => {
  service = billService;
};

export const getBills = async (req: any, res: any) => {
  try {
    const data = await service.getAll();
    console.log("Facturas obtenidas correctamente");
    
    return res.status(200).send({ body: data });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: `Error al conseguir las facturas ${error}`,
    });
  }
};

export const saveBill = async (req: any, res: any) => {
  try {
    const billData: SaveBillDTO = req.body;
    const result = await service.save(billSchema.parse(billData));

    console.log("Factura creada correctamente");
    return res.status(201).send({
      message: "Factura creada correctamente",
      data: result,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).send({
        status: "error",
        message: "Datos inválidos: " + error.issues[0].message,
        campo: error.issues[0].path,
        error: error.issues[0].code,
      });
    }

    console.error("Error al guardar factura:", error);
    return res.status(500).send({
      status: "error",
      message: `Error interno del servidor: ${error.message}`,
    });
  }
};

// Las funciones ya están exportadas individualmente arriba
