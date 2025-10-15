import { ca, tr } from "zod/v4/locales";
import { IService } from "../domain/interfaces/IService";
import { userSchema } from "../application/validations/UserValidations";

let service: IService;
export const setService = (userService: IService) => {
  service = userService;
};

export const saveUser = async (req: any, res: any) => {
  try {
    const data = req.body;
    const dataValidated = userSchema.parse(data);
    const result = await service.save(dataValidated);
    console.log("Usuario guardado correctamente");

    return res.status(201).send({
      status: "sucess",
      message: "El usuario fue registrado correctamente",
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

    console.log(error);
    res.status(500).send({
      status: "error",
      message: "Hubo un error: " + error.message,
      errors: error.errors || error.issues,
    });
  }
};

export const getUsers = async (req: any, res: any) => {
  try {
    const data = await service.getAll();
    console.log("Usuarios obtenidos correctamente");

    return res.status(200).send({
      status: "sucess",
      message: "Usuarios obtenidos correctamente",
      data: data,
    });
  } catch (error: any) {
    return res.status(500).send({
      status: "error",
      message: "Hubo un error al obtener los datos:\n" + error.message,
    });
  }
};
