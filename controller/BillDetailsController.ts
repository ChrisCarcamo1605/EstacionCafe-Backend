import { ca } from "zod/v4/locales";
import { BillDetailsSchema } from "../application/validations/BillDetailsValidations";
import { IService } from "../domain/interfaces/IService";

let service: IService;
export const setService = (detailsService: IService) => {
  service = detailsService;
};

export const saveDetails = async (req: any, res: any) => {
  try {
    const data = req.body;
    const result = await service.saveAll(data);

    console.log("Factura y detalles guardados correctamente");
    return res.status(201).send({
      status: "success",
      message: "Factura y detalles guardados correctamente",
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

    console.log(error.message);
    return res.status(500).send({
      status: "error",
      message: "Hubo en error en el servidor al guardar el detalle",
      errors: error,
    });
  }
};

export const getDetails = async (req: any, res: any) => {
  try {
    const data = await service.getAll();
    console.log("Detalles obtenidos corretamente");

    return res.status(200).send({
      status: "success",
      message: "Detalles obtenidos corretamente",
      data: data,
    });
  } catch (error: any) {
    console.log(error);

    if (error.name === "ZodError") {
      return res.status(400).send({
        status: "error",
        message: "Datos inválidos: " + error.issues[0].message,
        campo: error.issues[0].path,
        error: error.issues[0].code,
      });
    }

    return res.status(500).send({
      status: "error",
      message: "Hubo un error en el servidor",
      errors: error.error,
    });
  }
};
