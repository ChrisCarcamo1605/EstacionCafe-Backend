import * as cashRegisterController from "../CashRegisterController";
import { IService } from "../../core/interfaces/IService";
import {
  createCashRegisterSchema,
  updateCashRegisterSchema,
  cashRegisterIdSchema,
} from "../../application/validations/CashRegisterValidations";

jest.mock("../../application/validations/CashRegisterValidations");
const mockedCreateCashRegisterSchema = createCashRegisterSchema as jest.Mocked<
  typeof createCashRegisterSchema
>;
const mockedUpdateCashRegisterSchema = updateCashRegisterSchema as jest.Mocked<
  typeof updateCashRegisterSchema
>;
const mockedCashRegisterIdSchema = cashRegisterIdSchema as jest.Mocked<
  typeof cashRegisterIdSchema
>;

describe("CashRegisterController", () => {
  let mockService: jest.Mocked<IService>;
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    // Crear el mock del servicio con métodos adicionales específicos de CashRegister
    mockService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      save: jest.fn(),
      saveAll: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    } as any;

    // Añadir métodos específicos del CashRegisterService
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
    it("debería obtener todas las cajas registradoras exitosamente", async () => {
      const cajasRegistradorasSimuladas = [
        {
          cashRegisterId: 1,
          number: 1,
          active: true,
        },
        {
          cashRegisterId: 2,
          number: 2,
          active: false,
        },
      ];

      mockService.getAll.mockResolvedValue(cajasRegistradorasSimuladas);

      await cashRegisterController.getCashRegisters(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        message: "Cajas registradoras obtenidas correctamente",
        data: cajasRegistradorasSimuladas,
      });
      expect(console.log).toHaveBeenCalledWith(
        "Cajas registradoras obtenidas correctamente",
      );
    });

    it("debería manejar errores del servidor al obtener cajas registradoras", async () => {
      const errorServidor = new Error("Error de conexión a la base de datos");

      mockService.getAll.mockRejectedValue(errorServidor);

      await cashRegisterController.getCashRegisters(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error al obtener las cajas registradoras: ${errorServidor.message}`,
      });
      expect(console.log).not.toHaveBeenCalledWith(
        "Cajas registradoras obtenidas correctamente",
      );
    });

    it("debería retornar un array vacío cuando no hay cajas registradoras", async () => {
      const cajasVacias: any[] = [];

      mockService.getAll.mockResolvedValue(cajasVacias);

      await cashRegisterController.getCashRegisters(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        message: "Cajas registradoras obtenidas correctamente",
        data: cajasVacias,
      });
      expect(console.log).toHaveBeenCalledWith(
        "Cajas registradoras obtenidas correctamente",
      );
    });
  });

  describe("getCashRegisterById", () => {
    it("debería obtener una caja registradora por ID exitosamente", async () => {
      const cajaRegistradora = {
        cashRegisterId: 1,
        number: 1,
        active: true,
      };

      mockReq.params = { id: "1" };
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 1 });
      mockService.getById.mockResolvedValue(cajaRegistradora);

      await cashRegisterController.getCashRegisterById(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith({
        id: "1",
      });
      expect(mockService.getById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        message: "Caja registradora obtenida correctamente",
        data: cajaRegistradora,
      });
      expect(console.log).toHaveBeenCalledWith(
        "Caja registradora obtenida correctamente",
      );
    });

    it("debería manejar errores de validación ZodError para ID inválido", async () => {
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El ID debe ser un número positivo",
            path: ["id"],
            code: "custom",
          },
        ],
      };

      mockReq.params = { id: "invalid" };
      mockedCashRegisterIdSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await cashRegisterController.getCashRegisterById(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith({
        id: "invalid",
      });
      expect(mockService.getById).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "ID inválido: El ID debe ser un número positivo",
      });
      expect(console.log).not.toHaveBeenCalledWith(
        "Caja registradora obtenida correctamente",
      );
    });

    it("debería manejar error cuando la caja registradora no existe", async () => {
      const errorNoEncontrada = new Error("Caja registradora no encontrada");

      mockReq.params = { id: "999" };
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 999 });
      mockService.getById.mockRejectedValue(errorNoEncontrada);

      await cashRegisterController.getCashRegisterById(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith({
        id: "999",
      });
      expect(mockService.getById).toHaveBeenCalledWith(999);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: errorNoEncontrada.message,
      });
    });

    it("debería manejar errores generales del servidor", async () => {
      const errorServidor = new Error("Error interno del servidor");

      mockReq.params = { id: "1" };
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 1 });
      mockService.getById.mockRejectedValue(errorServidor);

      await cashRegisterController.getCashRegisterById(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith({
        id: "1",
      });
      expect(mockService.getById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error al obtener la caja registradora: ${errorServidor.message}`,
      });
    });
  });

  describe("saveCashRegister", () => {
    it("debería guardar una caja registradora exitosamente", async () => {
      const datosCajaRegistradora = {
        number: "1",
        active: true,
      };

      const datosValidados = {
        number: 1,
        active: true,
      };

      const cajaRegistradoraGuardada = {
        cashRegisterId: 1,
        number: 1,
        active: true,
      };

      mockReq.body = datosCajaRegistradora;
      mockedCreateCashRegisterSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(cajaRegistradoraGuardada);

      await cashRegisterController.saveCashRegister(mockReq, mockRes);

      expect(mockedCreateCashRegisterSchema.parse).toHaveBeenCalledWith(
        datosCajaRegistradora,
      );
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        message: "Caja registradora creada correctamente",
        data: cajaRegistradoraGuardada,
      });
      expect(console.log).toHaveBeenCalledWith(
        "Caja registradora creada correctamente",
      );
    });

    it("debería guardar una caja registradora con active por defecto (true)", async () => {
      const datosCajaRegistradora = {
        number: "2",
      };

      const datosValidados = {
        number: 2,
        active: true,
      };

      const cajaRegistradoraGuardada = {
        cashRegisterId: 2,
        number: 2,
        active: true,
      };

      mockReq.body = datosCajaRegistradora;
      mockedCreateCashRegisterSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(cajaRegistradoraGuardada);

      await cashRegisterController.saveCashRegister(mockReq, mockRes);

      expect(mockedCreateCashRegisterSchema.parse).toHaveBeenCalledWith(
        datosCajaRegistradora,
      );
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("debería manejar errores de validación ZodError para número vacío", async () => {
      const datosInvalidos = {
        number: "",
        active: true,
      };

      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El número es requerido",
            path: ["number"],
            code: "too_small",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedCreateCashRegisterSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await cashRegisterController.saveCashRegister(mockReq, mockRes);

      expect(mockedCreateCashRegisterSchema.parse).toHaveBeenCalledWith(
        datosInvalidos,
      );
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El número es requerido",
        campo: ["number"],
        error: "too_small",
      });
      expect(console.log).not.toHaveBeenCalledWith(
        "Caja registradora creada correctamente",
      );
    });

    it("debería manejar errores de validación ZodError para número muy largo", async () => {
      const numeroMuyLargo = "1".repeat(21);
      const datosInvalidos = {
        number: numeroMuyLargo,
        active: true,
      };

      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El número es muy largo",
            path: ["number"],
            code: "too_big",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedCreateCashRegisterSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await cashRegisterController.saveCashRegister(mockReq, mockRes);

      expect(mockedCreateCashRegisterSchema.parse).toHaveBeenCalledWith(
        datosInvalidos,
      );
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El número es muy largo",
        campo: ["number"],
        error: "too_big",
      });
    });

    it("debería manejar errores de validación ZodError para número no positivo", async () => {
      const datosInvalidos = {
        number: "0",
        active: true,
      };

      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El ID debe ser un número positivo",
            path: ["number"],
            code: "custom",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedCreateCashRegisterSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await cashRegisterController.saveCashRegister(mockReq, mockRes);

      expect(mockedCreateCashRegisterSchema.parse).toHaveBeenCalledWith(
        datosInvalidos,
      );
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El ID debe ser un número positivo",
        campo: ["number"],
        error: "custom",
      });
    });

    it("debería manejar errores de validación ZodError para número no numérico", async () => {
      const datosInvalidos = {
        number: "abc",
        active: true,
      };

      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El ID debe ser un número positivo",
            path: ["number"],
            code: "custom",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedCreateCashRegisterSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await cashRegisterController.saveCashRegister(mockReq, mockRes);

      expect(mockedCreateCashRegisterSchema.parse).toHaveBeenCalledWith(
        datosInvalidos,
      );
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El ID debe ser un número positivo",
        campo: ["number"],
        error: "custom",
      });
    });

    it("debería manejar errores generales del servidor", async () => {
      const datosCajaRegistradora = {
        number: "1",
        active: true,
      };

      const datosValidados = {
        number: 1,
        active: true,
      };

      const errorServidor = new Error("Error interno del servidor");

      mockReq.body = datosCajaRegistradora;
      mockedCreateCashRegisterSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockRejectedValue(errorServidor);

      await cashRegisterController.saveCashRegister(mockReq, mockRes);

      expect(mockedCreateCashRegisterSchema.parse).toHaveBeenCalledWith(
        datosCajaRegistradora,
      );
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error interno del servidor: ${errorServidor.message}`,
      });
      expect(console.error).toHaveBeenCalledWith(
        "Error al crear caja registradora:",
        errorServidor,
      );
      expect(console.log).not.toHaveBeenCalledWith(
        "Caja registradora creada correctamente",
      );
    });

    it("debería manejar números con espacios (trim)", async () => {
      const datosConEspacios = {
        number: "   5   ",
        active: false,
      };

      const datosLimpios = {
        number: 5,
        active: false,
      };

      const cajaRegistradoraGuardada = {
        cashRegisterId: 1,
        number: 5,
        active: false,
      };

      mockReq.body = datosConEspacios;
      mockedCreateCashRegisterSchema.parse.mockReturnValue(datosLimpios);
      mockService.save.mockResolvedValue(cajaRegistradoraGuardada);

      await cashRegisterController.saveCashRegister(mockReq, mockRes);

      expect(mockedCreateCashRegisterSchema.parse).toHaveBeenCalledWith(
        datosConEspacios,
      );
      expect(mockService.save).toHaveBeenCalledWith(datosLimpios);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe("updateCashRegister", () => {
    it("debería actualizar una caja registradora exitosamente", async () => {
      const datosActualizacion = {
        number: "10",
        active: false,
      };

      const datosValidados = {
        number: 10,
        active: false,
      };

      const cajaRegistradoraActualizada = {
        cashRegisterId: 1,
        number: 10,
        active: false,
      };

      mockReq.params = { id: "1" };
      mockReq.body = datosActualizacion;
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 1 });
      mockedUpdateCashRegisterSchema.parse.mockReturnValue(datosValidados);
      mockService.update.mockResolvedValue(cajaRegistradoraActualizada);

      await cashRegisterController.updateCashRegister(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith({
        id: "1",
      });
      expect(mockedUpdateCashRegisterSchema.parse).toHaveBeenCalledWith(
        datosActualizacion,
      );
      expect(mockService.update).toHaveBeenCalledWith({
        cashRegisterId: 1,
        ...datosValidados,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        message: "Caja registradora actualizada correctamente",
        data: cajaRegistradoraActualizada,
      });
      expect(console.log).toHaveBeenCalledWith(
        "Caja registradora actualizada correctamente",
      );
    });

    it("debería actualizar solo el número", async () => {
      const datosActualizacion = {
        number: "15",
      };

      const datosValidados = {
        number: 15,
      };

      const cajaRegistradoraActualizada = {
        cashRegisterId: 1,
        number: 15,
        active: true,
      };

      mockReq.params = { id: "1" };
      mockReq.body = datosActualizacion;
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 1 });
      mockedUpdateCashRegisterSchema.parse.mockReturnValue(datosValidados);
      mockService.update.mockResolvedValue(cajaRegistradoraActualizada);

      await cashRegisterController.updateCashRegister(mockReq, mockRes);

      expect(mockService.update).toHaveBeenCalledWith({
        cashRegisterId: 1,
        ...datosValidados,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("debería actualizar solo el estado activo", async () => {
      const datosActualizacion = {
        active: false,
      };

      const datosValidados = {
        number: 1, // Se requiere number en el schema de update
        active: false,
      };

      const cajaRegistradoraActualizada = {
        cashRegisterId: 1,
        number: 1,
        active: false,
      };

      mockReq.params = { id: "1" };
      mockReq.body = datosActualizacion;
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 1 });
      mockedUpdateCashRegisterSchema.parse.mockReturnValue(datosValidados);
      mockService.update.mockResolvedValue(cajaRegistradoraActualizada);

      await cashRegisterController.updateCashRegister(mockReq, mockRes);

      expect(mockService.update).toHaveBeenCalledWith({
        cashRegisterId: 1,
        ...datosValidados,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("debería manejar errores de validación ZodError para ID inválido", async () => {
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El ID debe ser un número positivo",
            path: ["id"],
            code: "custom",
          },
        ],
      };

      mockReq.params = { id: "invalid" };
      mockReq.body = { number: "1" };
      mockedCashRegisterIdSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await cashRegisterController.updateCashRegister(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith({
        id: "invalid",
      });
      expect(mockedUpdateCashRegisterSchema.parse).not.toHaveBeenCalled();
      expect(mockService.update).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El ID debe ser un número positivo",
        campo: ["id"],
      });
    });

    it("debería manejar errores de validación ZodError para datos de actualización inválidos", async () => {
      const datosInvalidos = {
        number: "",
        active: true,
      };

      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El número es requerido",
            path: ["number"],
            code: "too_small",
          },
        ],
      };

      mockReq.params = { id: "1" };
      mockReq.body = datosInvalidos;
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 1 });
      mockedUpdateCashRegisterSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await cashRegisterController.updateCashRegister(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith({
        id: "1",
      });
      expect(mockedUpdateCashRegisterSchema.parse).toHaveBeenCalledWith(
        datosInvalidos,
      );
      expect(mockService.update).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El número es requerido",
        campo: ["number"],
      });
    });

    it("debería manejar error cuando la caja registradora no existe", async () => {
      const errorNoEncontrada = new Error("Caja registradora no encontrada");

      mockReq.params = { id: "999" };
      mockReq.body = { number: "1" };
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 999 });
      mockedUpdateCashRegisterSchema.parse.mockReturnValue({ number: 1 });
      mockService.update.mockRejectedValue(errorNoEncontrada);

      await cashRegisterController.updateCashRegister(mockReq, mockRes);

      expect(mockService.update).toHaveBeenCalledWith({
        cashRegisterId: 999,
        number: 1,
      });
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: errorNoEncontrada.message,
      });
    });

    it("debería manejar errores generales del servidor", async () => {
      const errorServidor = new Error("Error interno del servidor");

      mockReq.params = { id: "1" };
      mockReq.body = { number: "1" };
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 1 });
      mockedUpdateCashRegisterSchema.parse.mockReturnValue({ number: 1 });
      mockService.update.mockRejectedValue(errorServidor);

      await cashRegisterController.updateCashRegister(mockReq, mockRes);

      expect(mockService.update).toHaveBeenCalledWith({
        cashRegisterId: 1,
        number: 1,
      });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error interno del servidor: ${errorServidor.message}`,
      });
      expect(console.error).toHaveBeenCalledWith(
        "Error al actualizar caja registradora:",
        errorServidor,
      );
    });
  });

  describe("deleteCashRegister", () => {
    it("debería eliminar una caja registradora exitosamente", async () => {
      const cajaRegistradoraEliminada = {
        cashRegisterId: 1,
        number: 1,
        active: true,
      };

      mockReq.params = { id: "1" };
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 1 });
      mockService.delete.mockResolvedValue(cajaRegistradoraEliminada);

      await cashRegisterController.deleteCashRegister(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith({
        id: "1",
      });
      expect(mockService.delete).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        message: "Caja registradora eliminada correctamente",
        data: cajaRegistradoraEliminada,
      });
      expect(console.log).toHaveBeenCalledWith(
        "Caja registradora eliminada correctamente",
      );
    });

    it("debería manejar errores de validación ZodError para ID inválido", async () => {
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El ID debe ser un número positivo",
            path: ["id"],
            code: "custom",
          },
        ],
      };

      mockReq.params = { id: "invalid" };
      mockedCashRegisterIdSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await cashRegisterController.deleteCashRegister(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith({
        id: "invalid",
      });
      expect(mockService.delete).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "ID inválido: El ID debe ser un número positivo",
      });
      expect(console.log).not.toHaveBeenCalledWith(
        "Caja registradora eliminada correctamente",
      );
    });

    it("debería manejar error cuando la caja registradora no existe", async () => {
      const errorNoEncontrada = new Error("Caja registradora no encontrada");

      mockReq.params = { id: "999" };
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 999 });
      mockService.delete.mockRejectedValue(errorNoEncontrada);

      await cashRegisterController.deleteCashRegister(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith({
        id: "999",
      });
      expect(mockService.delete).toHaveBeenCalledWith(999);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: errorNoEncontrada.message,
      });
    });

    it("debería manejar errores generales del servidor", async () => {
      const errorServidor = new Error("Error interno del servidor");

      mockReq.params = { id: "1" };
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 1 });
      mockService.delete.mockRejectedValue(errorServidor);

      await cashRegisterController.deleteCashRegister(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith({
        id: "1",
      });
      expect(mockService.delete).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error interno del servidor: ${errorServidor.message}`,
      });
      expect(console.error).toHaveBeenCalledWith(
        "Error al eliminar caja registradora:",
        errorServidor,
      );
    });
  });

  describe("getActiveCashRegisters", () => {
    it("debería obtener cajas registradoras activas exitosamente", async () => {
      const cajasActivas = [
        {
          cashRegisterId: 1,
          number: 1,
          active: true,
        },
        {
          cashRegisterId: 3,
          number: 3,
          active: true,
        },
      ];

      (mockService as any).getActiveCashRegisters.mockResolvedValue(
        cajasActivas,
      );

      await cashRegisterController.getActiveCashRegisters(mockReq, mockRes);

      expect((mockService as any).getActiveCashRegisters).toHaveBeenCalledTimes(
        1,
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        message: "Cajas registradoras activas obtenidas correctamente",
        data: cajasActivas,
      });
      expect(console.log).toHaveBeenCalledWith(
        "Cajas registradoras activas obtenidas correctamente",
      );
    });

    it("debería retornar array vacío cuando no hay cajas activas", async () => {
      const cajasVacias: any[] = [];

      (mockService as any).getActiveCashRegisters.mockResolvedValue(
        cajasVacias,
      );

      await cashRegisterController.getActiveCashRegisters(mockReq, mockRes);

      expect((mockService as any).getActiveCashRegisters).toHaveBeenCalledTimes(
        1,
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        message: "Cajas registradoras activas obtenidas correctamente",
        data: cajasVacias,
      });
      expect(console.log).toHaveBeenCalledWith(
        "Cajas registradoras activas obtenidas correctamente",
      );
    });

    it("debería manejar errores del servidor al obtener cajas activas", async () => {
      const errorServidor = new Error("Error de conexión a la base de datos");

      (mockService as any).getActiveCashRegisters.mockRejectedValue(
        errorServidor,
      );

      await cashRegisterController.getActiveCashRegisters(mockReq, mockRes);

      expect((mockService as any).getActiveCashRegisters).toHaveBeenCalledTimes(
        1,
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error al obtener las cajas registradoras activas: ${errorServidor.message}`,
      });
      expect(console.log).not.toHaveBeenCalledWith(
        "Cajas registradoras activas obtenidas correctamente",
      );
    });
  });

  describe("getCashRegisterByNumber", () => {
    it("debería obtener caja registradora por número exitosamente", async () => {
      const cajaRegistradora = {
        cashRegisterId: 1,
        number: 5,
        active: true,
      };

      mockReq.params = { number: "5" };
      (mockService as any).getByNumber.mockResolvedValue(cajaRegistradora);

      await cashRegisterController.getCashRegisterByNumber(mockReq, mockRes);

      expect((mockService as any).getByNumber).toHaveBeenCalledWith("5");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        message: "Caja registradora por número obtenida correctamente",
        data: cajaRegistradora,
      });
    });

    it("debería manejar números como strings", async () => {
      const cajaRegistradora = {
        cashRegisterId: 2,
        number: 10,
        active: false,
      };

      mockReq.params = { number: "10" };
      (mockService as any).getByNumber.mockResolvedValue(cajaRegistradora);

      await cashRegisterController.getCashRegisterByNumber(mockReq, mockRes);

      expect((mockService as any).getByNumber).toHaveBeenCalledWith("10");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        message: "Caja registradora por número obtenida correctamente",
        data: cajaRegistradora,
      });
    });

    it("debería manejar errores del servidor al buscar por número", async () => {
      const errorServidor = new Error("Error de conexión a la base de datos");

      mockReq.params = { number: "1" };
      (mockService as any).getByNumber.mockRejectedValue(errorServidor);

      await cashRegisterController.getCashRegisterByNumber(mockReq, mockRes);

      expect((mockService as any).getByNumber).toHaveBeenCalledWith("1");
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error al obtener la caja registradora por número: ${errorServidor.message}`,
      });
    });

    it("debería manejar cuando no se encuentra la caja por número", async () => {
      const errorNoEncontrada = new Error("Caja registradora no encontrada");

      mockReq.params = { number: "999" };
      (mockService as any).getByNumber.mockRejectedValue(errorNoEncontrada);

      await cashRegisterController.getCashRegisterByNumber(mockReq, mockRes);

      expect((mockService as any).getByNumber).toHaveBeenCalledWith("999");
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error al obtener la caja registradora por número: ${errorNoEncontrada.message}`,
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
      } as any;

      // Añadir métodos específicos del CashRegisterService
      nuevoServicio.getActiveCashRegisters = jest.fn();
      nuevoServicio.getByNumber = jest.fn();

      expect(() =>
        cashRegisterController.setService(nuevoServicio),
      ).not.toThrow();

      // Verificar que el servicio se estableció correctamente
      nuevoServicio.getAll.mockResolvedValue([]);
      await cashRegisterController.getCashRegisters(mockReq, mockRes);

      expect(nuevoServicio.getAll).toHaveBeenCalled();
    });
  });

  describe("Casos con diferentes números de caja", () => {
    const numerosCaja = [
      { number: "1", active: true },
      { number: "2", active: false },
      { number: "10", active: true },
      { number: "99", active: false },
      { number: "100", active: true },
      { number: "999", active: true },
    ];

    numerosCaja.forEach((caja) => {
      it(`debería guardar caja registradora con número: "${caja.number}"`, async () => {
        const datosValidados = {
          number: parseInt(caja.number),
          active: caja.active,
        };

        const cajaGuardada = {
          cashRegisterId: 1,
          ...datosValidados,
        };

        mockReq.body = caja;
        mockedCreateCashRegisterSchema.parse.mockReturnValue(datosValidados);
        mockService.save.mockResolvedValue(cajaGuardada);

        await cashRegisterController.saveCashRegister(mockReq, mockRes);

        expect(mockedCreateCashRegisterSchema.parse).toHaveBeenCalledWith(caja);
        expect(mockService.save).toHaveBeenCalledWith(datosValidados);
        expect(mockRes.status).toHaveBeenCalledWith(201);
      });
    });
  });

  describe("Casos límite de validación", () => {
    it("debería manejar número con exactamente 1 carácter", async () => {
      const datosMinimos = {
        number: "1",
        active: true,
      };

      const datosValidados = {
        number: 1,
        active: true,
      };

      const cajaGuardada = {
        cashRegisterId: 1,
        ...datosValidados,
      };

      mockReq.body = datosMinimos;
      mockedCreateCashRegisterSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(cajaGuardada);

      await cashRegisterController.saveCashRegister(mockReq, mockRes);

      expect(mockedCreateCashRegisterSchema.parse).toHaveBeenCalledWith(
        datosMinimos,
      );
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("debería manejar número con exactamente 20 caracteres", async () => {
      const numeroMaximo = "1".repeat(20);
      const datosMaximos = {
        number: numeroMaximo,
        active: false,
      };

      const datosValidados = {
        number: parseInt(numeroMaximo),
        active: false,
      };

      const cajaGuardada = {
        cashRegisterId: 1,
        ...datosValidados,
      };

      mockReq.body = datosMaximos;
      mockedCreateCashRegisterSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(cajaGuardada);

      await cashRegisterController.saveCashRegister(mockReq, mockRes);

      expect(mockedCreateCashRegisterSchema.parse).toHaveBeenCalledWith(
        datosMaximos,
      );
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("debería manejar transformaciones de string a number correctamente", async () => {
      const datosCaja = {
        number: "42",
        active: true,
      };

      const datosValidados = {
        number: 42,
        active: true,
      };

      const cajaGuardada = {
        cashRegisterId: 1,
        ...datosValidados,
      };

      mockReq.body = datosCaja;
      mockedCreateCashRegisterSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(cajaGuardada);

      await cashRegisterController.saveCashRegister(mockReq, mockRes);

      expect(mockedCreateCashRegisterSchema.parse).toHaveBeenCalledWith(
        datosCaja,
      );
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("debería manejar valores booleanos para active correctamente", async () => {
      const casos = [
        { number: "1", active: true },
        { number: "2", active: false },
        { number: "3" }, // sin active, debería usar default
      ];

      for (const caso of casos) {
        const datosValidados = {
          number: parseInt(caso.number),
          active: caso.active !== undefined ? caso.active : true,
        };

        const cajaGuardada = {
          cashRegisterId: 1,
          ...datosValidados,
        };

        mockReq.body = caso;
        mockedCreateCashRegisterSchema.parse.mockReturnValue(datosValidados);
        mockService.save.mockResolvedValue(cajaGuardada);

        await cashRegisterController.saveCashRegister(mockReq, mockRes);

        expect(mockedCreateCashRegisterSchema.parse).toHaveBeenCalledWith(caso);
        expect(mockService.save).toHaveBeenCalledWith(datosValidados);
        expect(mockRes.status).toHaveBeenCalledWith(201);

        jest.clearAllMocks();
        mockReq.body = {};
      }
    });
  });

  describe("Transformaciones de ID y números", () => {
    it("debería manejar IDs como strings que se convierten a números", async () => {
      const cajaRegistradora = {
        cashRegisterId: 42,
        number: 5,
        active: true,
      };

      mockReq.params = { id: "42" };
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: 42 });
      mockService.getById.mockResolvedValue(cajaRegistradora);

      await cashRegisterController.getCashRegisterById(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith({
        id: "42",
      });
      expect(mockService.getById).toHaveBeenCalledWith(42);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("debería manejar IDs grandes correctamente", async () => {
      const idGrande = 999999;
      const cajaRegistradora = {
        cashRegisterId: idGrande,
        number: 1,
        active: true,
      };

      mockReq.params = { id: idGrande.toString() };
      mockedCashRegisterIdSchema.parse.mockReturnValue({ id: idGrande });
      mockService.getById.mockResolvedValue(cajaRegistradora);

      await cashRegisterController.getCashRegisterById(mockReq, mockRes);

      expect(mockedCashRegisterIdSchema.parse).toHaveBeenCalledWith({
        id: idGrande.toString(),
      });
      expect(mockService.getById).toHaveBeenCalledWith(idGrande);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });
});
