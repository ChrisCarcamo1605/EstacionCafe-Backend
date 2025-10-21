import * as cashRegisterController from "../CashRegisterController";
import { IService } from "../../core/interfaces/IService";
import { 
  createCashRegisterSchema, 
  updateCashRegisterSchema, 
  cashRegisterIdSchema 
} from "../../application/validations/CashRegisterValidations";
import { CashRegister } from "../../core/entities/CashRegister";

jest.mock("../../application/validations/CashRegisterValidations");
const mockedCreateCashRegisterSchema = createCashRegisterSchema as jest.Mocked<typeof createCashRegisterSchema>;
const mockedUpdateCashRegisterSchema = updateCashRegisterSchema as jest.Mocked<typeof updateCashRegisterSchema>;
const mockedCashRegisterIdSchema = cashRegisterIdSchema as jest.Mocked<typeof cashRegisterIdSchema>;

describe("CashRegisterController", () => {
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

    // Mock adicional para métodos específicos del CashRegisterService
    (mockService as any).getActiveCashRegisters = jest.fn();
    (mockService as any).getByNumber = jest.fn();

    // Establecer el servicio mock
    cashRegisterController.setService(mockService);

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

  describe("getCashRegisters", () => {
    it("debería retornar las cajas registradoras exitosamente", async () => {
      const cajasSimuladas = [
        { cashRegisterId: 1, number: "CAJA001", active: true },
        { cashRegisterId: 2, number: "CAJA002", active: false },
      ];

      mockService.getAll.mockResolvedValue(cajasSimuladas);

      await cashRegisterController.getCashRegisters(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ body: cajasSimuladas });
    });

    it("debería manejar errores al obtener las cajas registradoras", async () => {
      const mensajeError = "Error de conexión a la base de datos";
      mockService.getAll.mockRejectedValue(new Error(mensajeError));

      await cashRegisterController.getCashRegisters(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error al obtener las cajas registradoras: ${mensajeError}`,
      });
    });
  });

  describe("getCashRegisterById", () => {
    it("debería retornar la caja registradora por ID exitosamente", async () => {
      const cajaSimulada = [{ cashRegisterId: 1, number: "CAJA001", active: true }];
      const idParams = { id: "1" };

      mockReq.params = idParams;
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 1 });
      mockService.getById.mockResolvedValue(cajaSimulada);

      await cashRegisterController.getCashRegisterById(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith(idParams);
      expect(mockService.getById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ body: cajaSimulada });
    });

    it("debería manejar errores de validación ZodError para ID inválido", async () => {
      const idInvalido = { id: "invalid" };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El ID debe ser un número entero",
            path: ["id"],
            code: "invalid_type",
          },
        ],
      };

      mockReq.params = idInvalido;
      mockedCashRegisterIdSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await cashRegisterController.getCashRegisterById(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith(idInvalido);
      expect(mockService.getById).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "ID inválido: El ID debe ser un número entero",
      });
    });

    it("debería manejar el caso cuando la caja registradora no es encontrada", async () => {
      const idParams = { id: "999" };
      const errorNoEncontrada = new Error("Caja registradora no encontrada");

      mockReq.params = idParams;
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 999 });
      mockService.getById.mockRejectedValue(errorNoEncontrada);

      await cashRegisterController.getCashRegisterById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Caja registradora no encontrada",
      });
    });

    it("debería manejar errores generales del servidor", async () => {
      const idParams = { id: "1" };
      const errorServidor = new Error("Error interno del servidor");

      mockReq.params = idParams;
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 1 });
      mockService.getById.mockRejectedValue(errorServidor);

      await cashRegisterController.getCashRegisterById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Error al obtener la caja registradora: Error interno del servidor",
      });
    });
  });

  describe("createCashRegister", () => {
    it("debería crear la caja registradora exitosamente", async () => {
      const datosCaja = {
        number: "CAJA001",
        active: true,
      };

      const cajaGuardada = { cashRegisterId: 1, ...datosCaja };

      mockReq.body = datosCaja;
      mockedCreateCashRegisterSchema.parse.mockReturnValue(datosCaja);
      mockService.save.mockResolvedValue(cajaGuardada);

      await cashRegisterController.createCashRegister(mockReq, mockRes);

      expect(mockedCreateCashRegisterSchema.parse).toHaveBeenCalledWith(datosCaja);
      expect(mockService.save).toHaveBeenCalledWith(datosCaja);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "Caja registradora creada correctamente",
        data: cajaGuardada,
      });
    });

    it("debería manejar errores de validación ZodError", async () => {
      const datosInvalidos = { number: "" };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El número de caja es requerido",
            path: ["number"],
            code: "too_small",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedCreateCashRegisterSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await cashRegisterController.createCashRegister(mockReq, mockRes);

      expect(mockedCreateCashRegisterSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El número de caja es requerido",
        campo: ["number"],
        error: "too_small",
      });
    });

    it("debería manejar errores generales del servidor", async () => {
      const datosCaja = { number: "CAJA001", active: true };
      const errorServidor = new Error("Error interno del servidor");

      mockReq.body = datosCaja;
      mockedCreateCashRegisterSchema.parse.mockReturnValue(datosCaja);
      mockService.save.mockRejectedValue(errorServidor);

      await cashRegisterController.createCashRegister(mockReq, mockRes);

      expect(mockedCreateCashRegisterSchema.parse).toHaveBeenCalledWith(datosCaja);
      expect(mockService.save).toHaveBeenCalledWith(datosCaja);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Error interno del servidor: Error interno del servidor",
      });
    });

    it("debería manejar errores sin mensaje específico", async () => {
      const datosCaja = { number: "CAJA001", active: true };
      const errorSinMensaje = {};

      mockReq.body = datosCaja;
      mockedCreateCashRegisterSchema.parse.mockReturnValue(datosCaja);
      mockService.save.mockRejectedValue(errorSinMensaje);

      await cashRegisterController.createCashRegister(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Error interno del servidor: undefined",
      });
    });
  });

  describe("updateCashRegister", () => {
    it("debería actualizar la caja registradora exitosamente", async () => {
      const idParams = { id: "1" };
      const datosActualizacion = { number: "CAJA001_UPDATED", active: false };
      const cajaActualizada = { cashRegisterId: 1, ...datosActualizacion };

      mockReq.params = idParams;
      mockReq.body = datosActualizacion;
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 1 });
      mockedUpdateCashRegisterSchema.parse.mockReturnValue(datosActualizacion);
      (mockService as any).update.mockResolvedValue(cajaActualizada);

      await cashRegisterController.updateCashRegister(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith(idParams);
      expect(mockedUpdateCashRegisterSchema.parse).toHaveBeenCalledWith(datosActualizacion);
      expect((mockService as any).update).toHaveBeenCalledWith({
        cashRegisterId: 1,
        ...datosActualizacion,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "Caja registradora actualizada correctamente",
        data: cajaActualizada,
      });
    });

    it("debería manejar errores de validación ZodError para ID inválido", async () => {
      const idInvalido = { id: "invalid" };
      const datosActualizacion = { number: "CAJA001" };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El ID debe ser un número entero",
            path: ["id"],
            code: "invalid_type",
          },
        ],
      };

      mockReq.params = idInvalido;
      mockReq.body = datosActualizacion;
      mockedCashRegisterIdSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await cashRegisterController.updateCashRegister(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith(idInvalido);
      expect(mockedUpdateCashRegisterSchema.parse).not.toHaveBeenCalled();
      expect((mockService as any).update).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El ID debe ser un número entero",
        campo: ["id"],
      });
    });

    it("debería manejar errores de validación ZodError para datos de actualización inválidos", async () => {
      const idParams = { id: "1" };
      const datosInvalidos = { number: "" };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El número de caja es requerido",
            path: ["number"],
            code: "too_small",
          },
        ],
      };

      mockReq.params = idParams;
      mockReq.body = datosInvalidos;
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 1 });
      mockedUpdateCashRegisterSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await cashRegisterController.updateCashRegister(mockReq, mockRes);

      expect(mockedUpdateCashRegisterSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect((mockService as any).update).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El número de caja es requerido",
        campo: ["number"],
      });
    });

    it("debería manejar el caso cuando la caja registradora no es encontrada", async () => {
      const idParams = { id: "999" };
      const datosActualizacion = { number: "CAJA999" };
      const errorNoEncontrada = new Error("Caja registradora no encontrada");

      mockReq.params = idParams;
      mockReq.body = datosActualizacion;
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 999 });
      mockedUpdateCashRegisterSchema.parse.mockReturnValue(datosActualizacion);
      (mockService as any).update.mockRejectedValue(errorNoEncontrada);

      await cashRegisterController.updateCashRegister(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Caja registradora no encontrada",
      });
    });

    it("debería manejar errores generales del servidor", async () => {
      const idParams = { id: "1" };
      const datosActualizacion = { number: "CAJA001" };
      const errorServidor = new Error("Error interno del servidor");

      mockReq.params = idParams;
      mockReq.body = datosActualizacion;
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 1 });
      mockedUpdateCashRegisterSchema.parse.mockReturnValue(datosActualizacion);
      (mockService as any).update.mockRejectedValue(errorServidor);

      await cashRegisterController.updateCashRegister(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Error interno del servidor: Error interno del servidor",
      });
    });
  });

  describe("deleteCashRegister", () => {
    it("debería eliminar la caja registradora exitosamente", async () => {
      const idParams = { id: "1" };
      const resultadoEliminacion = { affected: 1 };

      mockReq.params = idParams;
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 1 });
      mockService.delete.mockResolvedValue(resultadoEliminacion);

      await cashRegisterController.deleteCashRegister(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith(idParams);
      expect(mockService.delete).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "Caja registradora eliminada correctamente",
        data: resultadoEliminacion,
      });
    });

    it("debería manejar errores de validación ZodError para ID inválido", async () => {
      const idInvalido = { id: "invalid" };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El ID debe ser un número entero",
            path: ["id"],
            code: "invalid_type",
          },
        ],
      };

      mockReq.params = idInvalido;
      mockedCashRegisterIdSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await cashRegisterController.deleteCashRegister(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith(idInvalido);
      expect(mockService.delete).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "ID inválido: El ID debe ser un número entero",
      });
    });

    it("debería manejar el caso cuando la caja registradora no es encontrada", async () => {
      const idParams = { id: "999" };
      const errorNoEncontrada = new Error("Caja registradora no encontrada");

      mockReq.params = idParams;
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 999 });
      mockService.delete.mockRejectedValue(errorNoEncontrada);

      await cashRegisterController.deleteCashRegister(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Caja registradora no encontrada",
      });
    });

    it("debería manejar errores generales del servidor", async () => {
      const idParams = { id: "1" };
      const errorServidor = new Error("Error interno del servidor");

      mockReq.params = idParams;
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 1 });
      mockService.delete.mockRejectedValue(errorServidor);

      await cashRegisterController.deleteCashRegister(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Error interno del servidor: Error interno del servidor",
      });
    });
  });

  describe("getActiveCashRegisters", () => {
    it("debería retornar las cajas registradoras activas exitosamente", async () => {
      const cajasActivas = [
        { cashRegisterId: 1, number: "CAJA001", active: true },
        { cashRegisterId: 3, number: "CAJA003", active: true },
      ];

      (mockService as any).getActiveCashRegisters.mockResolvedValue(cajasActivas);

      await cashRegisterController.getActiveCashRegisters(mockReq, mockRes);

      expect((mockService as any).getActiveCashRegisters).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ body: cajasActivas });
    });

    it("debería manejar errores al obtener las cajas registradoras activas", async () => {
      const mensajeError = "Error de conexión a la base de datos";
      (mockService as any).getActiveCashRegisters.mockRejectedValue(new Error(mensajeError));

      await cashRegisterController.getActiveCashRegisters(mockReq, mockRes);

      expect((mockService as any).getActiveCashRegisters).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error al obtener las cajas registradoras activas: ${mensajeError}`,
      });
    });
  });

  describe("getCashRegistersByNumber", () => {
    it("debería retornar las cajas registradoras por número exitosamente", async () => {
      const numero = "CAJA001";
      const cajaEncontrada = { cashRegisterId: 1, number: numero, active: true };

      mockReq.params = { number: numero };
      (mockService as any).getByNumber.mockResolvedValue(cajaEncontrada);

      await cashRegisterController.getCashRegistersByNumber(mockReq, mockRes);

      expect((mockService as any).getByNumber).toHaveBeenCalledWith(numero);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ body: cajaEncontrada });
    });

    it("debería manejar errores al obtener las cajas registradoras por número", async () => {
      const numero = "CAJA999";
      const mensajeError = "Error de conexión a la base de datos";

      mockReq.params = { number: numero };
      (mockService as any).getByNumber.mockRejectedValue(new Error(mensajeError));

      await cashRegisterController.getCashRegistersByNumber(mockReq, mockRes);

      expect((mockService as any).getByNumber).toHaveBeenCalledWith(numero);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error al obtener las cajas registradoras por número: ${mensajeError}`,
      });
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
      } as jest.Mocked<IService>;

      // Agregar métodos específicos del CashRegisterService
      (nuevoServicio as any).getActiveCashRegisters = jest.fn();
      (nuevoServicio as any).getByNumber = jest.fn();

      expect(() => cashRegisterController.setService(nuevoServicio)).not.toThrow();

      // Verificar que el servicio se estableció correctamente
      // ejecutando una función que lo use
      nuevoServicio.getAll.mockResolvedValue([]);
      await cashRegisterController.getCashRegisters(mockReq, mockRes);

      expect(nuevoServicio.getAll).toHaveBeenCalled();
    });
  });
});
