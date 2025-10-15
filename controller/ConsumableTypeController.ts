import { ConsumableTypeSchema } from "../application/validations/ConsumableValidations";
import { IService } from "../core/interfaces/IService";

let service: IService;

export const setService = (consumableTypeService: IService) => {
  service = consumableTypeService;
};

export const saveConsumableType = async (req: any, res: any) => {
  try {
    const data = req.body;
    const validatedData = ConsumableTypeSchema.parse(data);
    const result = await service.save(validatedData);

    return res.status(201).send({
      status: "sucess",
      message: "Tipo de consumible guardado correctamente",
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

    console.error("Error al guardar el tipo de consumible:", error);
    return res.status(500).send({
      status: "error",
      message: `Error interno del servidor: ${error.message}`,
    });
  }
};

export const getConsumableTypes = async (req: any, res: any) => {
  try {
    const data = await service.getAll();

    return res.status(200).send({
      status: "sucess",
      message: "Tipos de consumibles obtenidos correctamente",
      data: data,
    });
  } catch (error: any) {

     console.error("Error al obtener los tipos de consumibles:", error);
    return res.status(500).send({
      status: "error",
      message: `Error interno del servidor: ${error.message}`,
    });
  }
};

export const updateConsumableType = async (req: any, res: any) => {};

export const deleteConsumableType = async (req: any, res: any) => {};

