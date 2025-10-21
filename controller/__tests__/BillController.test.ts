import * as billController from "../BillController";
import { IService } from "../../core/interfaces/IService";
import { billSchema } from "../../application/validations/BillValidations";

// Corregir la ruta del mock (era BILLValidations, debe ser BillValidations)
jest.mock("../../application/validations/BillValidations");
const mockedBillSchema = billSchema as jest.Mocked<typeof billSchema>;

describe("BillController", () => {
  let mockService: jest.Mocked<IService>;
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    // Crear el mock del servicio
    mockService = {
      getAll: jest.fn(),
      save: jest.fn(),
      saveAll: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<IService>;

    // Establecer el servicio mock
    billController.setService(mockService);

    mockReq = {
      body: {},
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

  describe("getBills", () => {
    it("deberia retornar las facturas exitosamente", async () => {
      const facturasSimuladas = [
        { id: 1, clientName: "Cliente 1", total: 100 }, // Corregir "clienName" por "clientName"
        { id: 2, clientName: "Cliente 2", total: 300 },
      ];

      mockService.getAll.mockResolvedValue(facturasSimuladas);

      await billController.getBills(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ body: facturasSimuladas });
      expect(console.log).toHaveBeenCalledWith(
        "Facturas obtenidas correctamente"
      );
    });

    it("deberia manejar errores al obtener las facturas", async () => {
      const mensajeError = "Error de conexión a la base de datos";
      mockService.getAll.mockRejectedValue(new Error(mensajeError));

      await billController.getBills(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Error al conseguir las facturas Error: " + mensajeError,
      });
    });
  });

  describe("saveBill", () => {
    it("deberia guardar la factura exitosamente", async () => {
      const datosFactura = {
        cashRegister: 1,
        customer: "Juan Pérez",
        total: 200,
        date: new Date(),
      };

      const facturaGuardada = { id: 1, ...datosFactura };

      mockReq.body = datosFactura;
      mockedBillSchema.parse.mockReturnValue(datosFactura);
      mockService.save.mockResolvedValue(facturaGuardada);

      await billController.saveBill(mockReq, mockRes);

      expect(mockedBillSchema.parse).toHaveBeenCalledWith(datosFactura);
      expect(mockService.save).toHaveBeenCalledWith(datosFactura);
      // Corregir: debe verificar status(201) y luego send()
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "Factura creada correctamente",
        data: facturaGuardada,
      });
      expect(console.log).toHaveBeenCalledWith("Factura creada correctamente");
    });

    // Corregir: este it estaba anidado incorrectamente dentro del anterior
    it("debería manejar errores de validación ZodError", async () => {
      const datosInvalidos = { clientName: "" };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El nombre del cliente es requerido",
            path: ["clientName"],
            code: "invalid_type",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedBillSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await billController.saveBill(mockReq, mockRes);

      expect(mockedBillSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El nombre del cliente es requerido",
        campo: ["clientName"],
        error: "invalid_type",
      });
    });

    it("debería manejar errores generales del servidor", async () => {
      const datosFactura = { clientName: "Juan Pérez" };
      const errorServidor = new Error("Error interno del servidor");

      mockReq.body = datosFactura;
      mockedBillSchema.parse.mockReturnValue({
        cashRegister: 1,
        customer: datosFactura.clientName,
        total: 0,
        date: new Date(),
      });
      mockService.save.mockRejectedValue(errorServidor);

      await billController.saveBill(mockReq, mockRes);

      expect(mockedBillSchema.parse).toHaveBeenCalledWith(datosFactura);
      expect(mockService.save).toHaveBeenCalledWith({
        cashRegister: 1,
        customer: datosFactura.clientName,
        total: 0,
        date: expect.any(Date),
      });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Error interno del servidor: Error interno del servidor",
      });
      expect(console.error).toHaveBeenCalledWith(
        "Error al guardar factura:",
        errorServidor
      );
    });

    it("debería manejar errores sin mensaje específico", async () => {
      const datosFactura = { clientName: "Juan Pérez" };
      const errorSinMensaje = {};

      mockReq.body = datosFactura;
      mockedBillSchema.parse.mockReturnValue({
        cashRegister: 1,
        customer: datosFactura.clientName,
        total: 0,
        date: new Date(),
      });
      mockService.save.mockRejectedValue(errorSinMensaje);

      await billController.saveBill(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Error interno del servidor: undefined",
      });
    });
  });

  describe("setService", () => {
    it("debería establecer el servicio correctamente", async () => {
      const nuevoServicio = {
        getAll: jest.fn(),
        save: jest.fn(),
        saveAll: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
      } as jest.Mocked<IService>;

      expect(() => billController.setService(nuevoServicio)).not.toThrow();

      // Verificar que el servicio se estableció correctamente
      // ejecutando una función que lo use
      nuevoServicio.getAll.mockResolvedValue([]);
      await billController.getBills(mockReq, mockRes);

      expect(nuevoServicio.getAll).toHaveBeenCalled();
    });
  });
});
