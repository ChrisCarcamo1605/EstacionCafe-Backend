import { IngredientSchema } from "../application/validations/IngredientValidations";
import { IService } from "../core/interfaces/IService";

let service: IService;
export const setService = (ingredientService: IService) => {
  service = ingredientService;
};

export const saveIngredient = async (req: any, res: any) => {
  try {
    const data = req.body;
    const validatedData = IngredientSchema.parse(data);
    const result = await service.save(validatedData);
    console.log("Ingrediente guardado correctamente");
    return res.status(201).send({
      status: "sucess",
      message: "Ingrediente guardado correctamente",
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

    console.error("Error al guardar el ingrediente:", error);
    return res.status(500).send({
      status: "error",
      message: `Error interno del servidor: ${error.message}`,
    });
  }
};

export const getIngredients = async (req: any, res: any) => {
  try {
    const result = await service.getAll();
    console.log("Ingredientes obtenidos correctamente");
    return res.status(200).send({
      status: "sucess",
      message: "Ingredientes obtenidos correctamente",
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

    console.error("Error al conseguir los ingredientes:", error);
    return res.status(500).send({
      status: "error",
      message: `Error interno del servidor: ${error.message}`,
    });
  }
};
