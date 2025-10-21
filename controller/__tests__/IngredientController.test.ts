import * as ingredientController from "../IngredientController";
import { IService } from "../../core/interfaces/IService";
import { IngredientSchema } from "../../application/validations/IngredientValidations";

jest.mock("../../application/validations/IngredientValidations");
const mockedIngredientSchema = IngredientSchema as jest.Mocked<typeof IngredientSchema>;

describe("IngredientController", () => {
  let mockService: jest.Mocked<IService>;
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    // Crear el mock del servicio
    mockService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      save: jest.fn(),
      saveAll: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    } as any;

    // Establecer el servicio mock
    ingredientController.setService(mockService);

    mockReq = {
      body: {},
      params: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("saveIngredient", () => {
    it("debería guardar el ingrediente exitosamente", async () => {
      const datosIngrediente = {
        name: "Azúcar",
        quantity: "100",
        productId: "1",
        consumableId: "2",
      };

      const datosValidados = {
        name: "Azúcar",
        quantity: 100,
        productId: 1,
        consumableId: 2,
      };

      const ingredienteGuardado = { ingredientId: 1, ...datosValidados };

      mockReq.body = datosIngrediente;
      mockedIngredientSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(ingredienteGuardado);

      await ingredientController.saveIngredient(mockReq, mockRes);

      expect(mockedIngredientSchema.parse).toHaveBeenCalledWith(datosIngrediente);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "sucess",
        message: "Ingrediente guardado correctamente",
        data: ingredienteGuardado,
      });
      expect(console.log).toHaveBeenCalledWith("Ingrediente guardado correctamente");
    });

    it("debería manejar errores de validación ZodError para nombre vacío", async () => {
      const datosInvalidos = {
        name: "",
        quantity: "100",
        productId: "1",
        consumableId: "2",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El nombre es requerido",
            path: ["name"],
            code: "too_small",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedIngredientSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await ingredientController.saveIngredient(mockReq, mockRes);

      expect(mockedIngredientSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El nombre es requerido",
        campo: ["name"],
        error: "too_small",
      });
      expect(console.log).not.toHaveBeenCalled();
    });

    it("debería manejar errores de validación ZodError para nombre muy largo", async () => {
      const nombreMuyLargo = "a".repeat(256);
      const datosInvalidos = {
        name: nombreMuyLargo,
        quantity: "100",
        productId: "1",
        consumableId: "2",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El nombre no puede exceder 255 caracteres",
            path: ["name"],
            code: "too_big",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedIngredientSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await ingredientController.saveIngredient(mockReq, mockRes);

      expect(mockedIngredientSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El nombre no puede exceder 255 caracteres",
        campo: ["name"],
        error: "too_big",
      });
    });

    it("debería manejar errores de validación ZodError para quantity inválida", async () => {
      const datosInvalidos = {
        name: "Azúcar",
        quantity: "invalid",
        productId: "1",
        consumableId: "2",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "Cantidad inválida",
            path: ["quantity"],
            code: "custom",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedIngredientSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await ingredientController.saveIngredient(mockReq, mockRes);

      expect(mockedIngredientSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: Cantidad inválida",
        campo: ["quantity"],
        error: "custom",
      });
    });

    it("debería manejar errores de validación ZodError para productId inválido", async () => {
      const datosInvalidos = {
        name: "Azúcar",
        quantity: "100",
        productId: "invalid",
        consumableId: "2",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "ID del producto inválido",
            path: ["productId"],
            code: "custom",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedIngredientSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await ingredientController.saveIngredient(mockReq, mockRes);

      expect(mockedIngredientSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: ID del producto inválido",
        campo: ["productId"],
        error: "custom",
      });
    });

    it("debería manejar errores de validación ZodError para consumableId inválido", async () => {
      const datosInvalidos = {
        name: "Azúcar",
        quantity: "100",
        productId: "1",
        consumableId: "invalid",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "ID del consumible inválido",
            path: ["consumableId"],
            code: "custom",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedIngredientSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await ingredientController.saveIngredient(mockReq, mockRes);

      expect(mockedIngredientSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: ID del consumible inválido",
        campo: ["consumableId"],
        error: "custom",
      });
    });

    it("debería manejar errores generales del servidor", async () => {
      const datosIngrediente = {
        name: "Azúcar",
        quantity: "100",
        productId: "1",
        consumableId: "2",
      };

      const datosValidados = {
        name: "Azúcar",
        quantity: 100,
        productId: 1,
        consumableId: 2,
      };

      const errorServidor = new Error("Error interno del servidor");

      mockReq.body = datosIngrediente;
      mockedIngredientSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockRejectedValue(errorServidor);

      await ingredientController.saveIngredient(mockReq, mockRes);

      expect(mockedIngredientSchema.parse).toHaveBeenCalledWith(datosIngrediente);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Error interno del servidor: Error interno del servidor",
      });
      expect(console.error).toHaveBeenCalledWith(
        "Error al guardar el ingrediente:",
        errorServidor
      );
      expect(console.log).not.toHaveBeenCalled();
    });

    it("debería manejar errores sin mensaje específico", async () => {
      const datosIngrediente = {
        name: "Azúcar",
        quantity: "100",
        productId: "1",
        consumableId: "2",
      };

      const datosValidados = {
        name: "Azúcar",
        quantity: 100,
        productId: 1,
        consumableId: 2,
      };

      const errorSinMensaje = {};

      mockReq.body = datosIngrediente;
      mockedIngredientSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockRejectedValue(errorSinMensaje);

      await ingredientController.saveIngredient(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Error interno del servidor: undefined",
      });
    });

    it("debería manejar transformaciones de string a number correctamente", async () => {
      const datosIngrediente = {
        name: "Café molido",
        quantity: "50",
        productId: "3",
        consumableId: "4",
      };

      const datosValidados = {
        name: "Café molido",
        quantity: 50,
        productId: 3,
        consumableId: 4,
      };

      const ingredienteGuardado = { ingredientId: 2, ...datosValidados };

      mockReq.body = datosIngrediente;
      mockedIngredientSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(ingredienteGuardado);

      await ingredientController.saveIngredient(mockReq, mockRes);

      expect(mockedIngredientSchema.parse).toHaveBeenCalledWith(datosIngrediente);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "sucess",
        message: "Ingrediente guardado correctamente",
        data: ingredienteGuardado,
      });
    });
  });

  describe("getIngredients", () => {
    it("debería retornar los ingredientes exitosamente", async () => {
      const ingredientesSimulados = [
        {
          ingredientId: 1,
          name: "Azúcar",
          quantity: 100,
          productId: 1,
          consumableId: 2,
        },
        {
          ingredientId: 2,
          name: "Café molido",
          quantity: 50,
          productId: 3,
          consumableId: 4,
        },
      ];

      mockService.getAll.mockResolvedValue(ingredientesSimulados);

      await ingredientController.getIngredients(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "sucess",
        message: "Ingredientes obtenidos correctamente",
        data: ingredientesSimulados,
      });
      expect(console.log).toHaveBeenCalledWith("Ingredientes obtenidos correctamente");
    });

    it("debería manejar errores ZodError (caso poco probable pero contemplado)", async () => {
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "Error de validación inesperado",
            path: ["unexpected"],
            code: "custom",
          },
        ],
      };

      mockService.getAll.mockRejectedValue(errorZod);

      await ingredientController.getIngredients(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: Error de validación inesperado",
        campo: ["unexpected"],
        error: "custom",
      });
      expect(console.log).not.toHaveBeenCalled();
    });

    it("debería manejar errores al obtener los ingredientes", async () => {
      const mensajeError = "Error de conexión a la base de datos";
      mockService.getAll.mockRejectedValue(new Error(mensajeError));

      await ingredientController.getIngredients(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error interno del servidor: ${mensajeError}`,
      });
      expect(console.error).toHaveBeenCalledWith(
        "Error al conseguir los ingredientes:",
        new Error(mensajeError)
      );
      expect(console.log).not.toHaveBeenCalled();
    });

    it("debería manejar errores sin mensaje específico", async () => {
      const errorSinMensaje = {};
      mockService.getAll.mockRejectedValue(errorSinMensaje);

      await ingredientController.getIngredients(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Error interno del servidor: undefined",
      });
    });

    it("debería retornar un array vacío cuando no hay ingredientes", async () => {
      const ingredientesVacios: any[] = [];

      mockService.getAll.mockResolvedValue(ingredientesVacios);

      await ingredientController.getIngredients(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "sucess",
        message: "Ingredientes obtenidos correctamente",
        data: ingredientesVacios,
      });
      expect(console.log).toHaveBeenCalledWith("Ingredientes obtenidos correctamente");
    });
  });

  describe("setService", () => {
    it("debería establecer el servicio correctamente", async () => {
      const nuevoServicio = {
        getAll: jest.fn(),
        getById: jest.fn(),
        save: jest.fn(),
        saveAll: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
      } as any;

      expect(() => ingredientController.setService(nuevoServicio)).not.toThrow();

      // Verificar que el servicio se estableció correctamente
      // ejecutando una función que lo use
      nuevoServicio.getAll.mockResolvedValue([]);
      await ingredientController.getIngredients(mockReq, mockRes);

      expect(nuevoServicio.getAll).toHaveBeenCalled();
    });
  });

  describe("Casos de transformación de tipos", () => {
    it("debería manejar valores numéricos como strings en quantity", async () => {
      const datosIngrediente = {
        name: "Leche",
        quantity: "0", // Cantidad cero como string
        productId: "1",
        consumableId: "1",
      };

      const datosValidados = {
        name: "Leche",
        quantity: 0,
        productId: 1,
        consumableId: 1,
      };

      const ingredienteGuardado = { ingredientId: 1, ...datosValidados };

      mockReq.body = datosIngrediente;
      mockedIngredientSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(ingredienteGuardado);

      await ingredientController.saveIngredient(mockReq, mockRes);

      expect(mockedIngredientSchema.parse).toHaveBeenCalledWith(datosIngrediente);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("debería manejar IDs grandes como strings", async () => {
      const datosIngrediente = {
        name: "Vainilla",
        quantity: "25",
        productId: "999999",
        consumableId: "888888",
      };

      const datosValidados = {
        name: "Vainilla",
        quantity: 25,
        productId: 999999,
        consumableId: 888888,
      };

      const ingredienteGuardado = { ingredientId: 1, ...datosValidados };

      mockReq.body = datosIngrediente;
      mockedIngredientSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(ingredienteGuardado);

      await ingredientController.saveIngredient(mockReq, mockRes);

      expect(mockedIngredientSchema.parse).toHaveBeenCalledWith(datosIngrediente);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe("Casos con nombres especiales", () => {
    const nombresEspeciales = [
      "Café 100% Arábica",
      "Azúcar refinada",
      "Leche descremada 2%",
      "Canela en polvo",
      "Jarabe de vainilla",
      "Chocolate semi-amargo",
    ];

    nombresEspeciales.forEach((nombre) => {
      it(`debería guardar ingrediente con nombre: "${nombre}"`, async () => {
        const datosIngrediente = {
          name: nombre,
          quantity: "10",
          productId: "1",
          consumableId: "1",
        };

        const datosValidados = {
          name: nombre,
          quantity: 10,
          productId: 1,
          consumableId: 1,
        };

        const ingredienteGuardado = { ingredientId: 1, ...datosValidados };

        mockReq.body = datosIngrediente;
        mockedIngredientSchema.parse.mockReturnValue(datosValidados);
        mockService.save.mockResolvedValue(ingredienteGuardado);

        await ingredientController.saveIngredient(mockReq, mockRes);

        expect(mockedIngredientSchema.parse).toHaveBeenCalledWith(datosIngrediente);
        expect(mockService.save).toHaveBeenCalledWith(datosValidados);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.send).toHaveBeenCalledWith({
          status: "sucess",
          message: "Ingrediente guardado correctamente",
          data: ingredienteGuardado,
        });
      });
    });
  });
});
