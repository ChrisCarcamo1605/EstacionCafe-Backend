import { ConsumableSchema } from "../application/validations/ConsumableValidations";
import { IService } from "../core/interfaces/IService";

let service: IService;

export const setService = (consumableService: IService) => {
  service = consumableService;
};

export const saveConsumable = async (req: any, res: any) => {
  try {
    const data = req.body;
    const validatedData = ConsumableSchema.parse(data);
    const result = await service.save(validatedData);

    return res.status(201).send({
      status: "sucess",
      message: "Consumible guardado correctamente",
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

    console.error("Error al guardar el consumible:", error);
    return res.status(500).send({
      status: "error",
      message: `Error interno del servidor: ${error.message}`,
    });
  }
};

export const getConsumables = async (req: any, res: any) => {
  try {
    const data = await service.getAll();

    return res.status(200).send({
      status: "sucess",
      message: "Consumibles obtenidos correctamente",
      data: data,
    });
  } catch (error: any) {

     console.error("Error al obtener los consumibles:", error);
    return res.status(500).send({
      status: "error",
      message: `Error interno del servidor: ${error.message}`,
    });
  }
};

export const updateConsumable = async (req: any, res: any) => {};

export const deleteConsumable = async (req: any, res: any) => {};
