import { ca } from "zod/v4/locales";
import { IService } from "../core/interfaces/IService";
import { UserTypeSchema } from "../application/validations/UserTypeValidations";
import { stat } from "fs";

let service: IService;
export const setService = (typeService: IService) => (service = typeService);

export const saveType = async (req: any, res: any) => {
  try {
    const data = req.body;
    const dataValidated = UserTypeSchema.parse(data);
    const result = await service.save(dataValidated);
    console.log("Tipo de usuario guardado correctamente");

    return res.status(201).send({
      status: "sucess",
      message: "El tipo de usuario fue registrado correctamente",
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

    return res.status(500).send({
      status: "error",
      message: "Hubo un error",
      errors: error.errors || error.issues,
    });
  }
};

export const getTypes = async (req: any, res: any) => {
  try {
    const data = await service.getAll();
    console.log("Tipos de usuarios obtenidos exitosamente");
    
    return res.status(200).send({
      status: "sucess",
      message: "Tipos de usuarios obtenidos exitosamente",
      data: data,
    });
  } catch (error: any) {
    return res.status(500).send({
      status: "error",
      message: "Hubo un error al obtener los datos: " + error.message,
    });
  }
};
