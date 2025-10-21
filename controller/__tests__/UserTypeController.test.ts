import * as userTypeController from "../UserTypeController";
import { IService } from "../../core/interfaces/IService";
import { UserTypeSchema } from "../../application/validations/UserTypeValidations";

jest.mock("../../application/validations/UserTypeValidations");
const mockedUserTypeSchema = UserTypeSchema as jest.Mocked<typeof UserTypeSchema>;

describe("UserTypeController", () => {
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
    userTypeController.setService(mockService);

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

  describe("saveType", () => {
    it("debería guardar el tipo de usuario exitosamente", async () => {
      const datosTipo = {
        name: "Administrador",
        permissionLevel: "10",
      };

      const datosValidados = {
        name: "Administrador",
        permissionLevel: 10,
      };

      const tipoGuardado = { 
        typeId: 1, 
        ...datosValidados,
        active: true 
      };

      mockReq.body = datosTipo;
      mockedUserTypeSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(tipoGuardado);

      await userTypeController.saveType(mockReq, mockRes);

      expect(mockedUserTypeSchema.parse).toHaveBeenCalledWith(datosTipo);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "sucess",
        message: "El tipo de usuario fue registrado correctamente",
        data: tipoGuardado,
      });
      expect(console.log).toHaveBeenCalledWith("Tipo de usuario guardado correctamente");
    });

    it("debería manejar errores de validación ZodError para name muy corto", async () => {
      const datosInvalidos = {
        name: "abc", // Menos de 4 caracteres
        permissionLevel: "5",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "String must contain at least 4 character(s)",
            path: ["name"],
            code: "too_small",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedUserTypeSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await userTypeController.saveType(mockReq, mockRes);

      expect(mockedUserTypeSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: String must contain at least 4 character(s)",
        campo: ["name"],
        error: "too_small",
      });
      expect(console.log).not.toHaveBeenCalledWith("Tipo de usuario guardado correctamente");
    });

    it("debería manejar errores de validación ZodError para name muy largo", async () => {
      const nombreMuyLargo = "a".repeat(51); // Más de 50 caracteres
      const datosInvalidos = {
        name: nombreMuyLargo,
        permissionLevel: "5",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "String must contain at most 50 character(s)",
            path: ["name"],
            code: "too_big",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedUserTypeSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await userTypeController.saveType(mockReq, mockRes);

      expect(mockedUserTypeSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: String must contain at most 50 character(s)",
        campo: ["name"],
        error: "too_big",
      });
    });

    it("debería manejar errores de validación ZodError para permissionLevel inválido", async () => {
      const datosInvalidos = {
        name: "Gerente",
        permissionLevel: "invalid",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "Expected number, received nan",
            path: ["permissionLevel"],
            code: "invalid_type",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedUserTypeSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await userTypeController.saveType(mockReq, mockRes);

      expect(mockedUserTypeSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: Expected number, received nan",
        campo: ["permissionLevel"],
        error: "invalid_type",
      });
    });

    it("debería manejar errores de validación ZodError para permissionLevel negativo", async () => {
      const datosInvalidos = {
        name: "Empleado",
        permissionLevel: "-1",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El nivel de permisos debe ser mayor o igual a 0",
            path: ["permissionLevel"],
            code: "custom",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedUserTypeSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await userTypeController.saveType(mockReq, mockRes);

      expect(mockedUserTypeSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El nivel de permisos debe ser mayor o igual a 0",
        campo: ["permissionLevel"],
        error: "custom",
      });
    });

    it("debería manejar transformaciones de string a number en permissionLevel", async () => {
      const datosTipo = {
        name: "Supervisor",
        permissionLevel: "8", // String que se transforma a number
      };

      const datosValidados = {
        name: "Supervisor",
        permissionLevel: 8, // Transformado a number
      };

      const tipoGuardado = { 
        typeId: 1, 
        ...datosValidados,
        active: true 
      };

      mockReq.body = datosTipo;
      mockedUserTypeSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(tipoGuardado);

      await userTypeController.saveType(mockReq, mockRes);

      expect(mockedUserTypeSchema.parse).toHaveBeenCalledWith(datosTipo);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("debería manejar name con espacios (trim)", async () => {
      const datosConEspacios = {
        name: "   Cajero   ",
        permissionLevel: "3",
      };

      const datosLimpios = {
        name: "Cajero",
        permissionLevel: 3,
      };

      const tipoGuardado = { 
        typeId: 1, 
        ...datosLimpios,
        active: true 
      };

      mockReq.body = datosConEspacios;
      mockedUserTypeSchema.parse.mockReturnValue(datosLimpios);
      mockService.save.mockResolvedValue(tipoGuardado);

      await userTypeController.saveType(mockReq, mockRes);

      expect(mockedUserTypeSchema.parse).toHaveBeenCalledWith(datosConEspacios);
      expect(mockService.save).toHaveBeenCalledWith(datosLimpios);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("debería manejar errores generales del servidor", async () => {
      const datosTipo = {
        name: "Administrador",
        permissionLevel: "10",
      };

      const datosValidados = {
        name: "Administrador",
        permissionLevel: 10,
      };

      const errorServidor = new Error("Error interno del servidor");

      mockReq.body = datosTipo;
      mockedUserTypeSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockRejectedValue(errorServidor);

      await userTypeController.saveType(mockReq, mockRes);

      expect(mockedUserTypeSchema.parse).toHaveBeenCalledWith(datosTipo);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Hubo un error",
        errors: undefined,
      });
      expect(console.log).not.toHaveBeenCalledWith("Tipo de usuario guardado correctamente");
    });

    it("debería manejar errores con propiedades errors", async () => {
      const datosTipo = {
        name: "Administrador",
        permissionLevel: "10",
      };

      const datosValidados = {
        name: "Administrador",
        permissionLevel: 10,
      };

      const errorConErrors = {
        message: "Error con errores",
        errors: ["Error 1", "Error 2"],
      };

      mockReq.body = datosTipo;
      mockedUserTypeSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockRejectedValue(errorConErrors);

      await userTypeController.saveType(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Hubo un error",
        errors: ["Error 1", "Error 2"],
      });
    });

    it("debería manejar errores con propiedades issues", async () => {
      const datosTipo = {
        name: "Administrador",
        permissionLevel: "10",
      };

      const datosValidados = {
        name: "Administrador",
        permissionLevel: 10,
      };

      const errorConIssues = {
        message: "Error con issues",
        issues: ["Issue 1", "Issue 2"],
      };

      mockReq.body = datosTipo;
      mockedUserTypeSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockRejectedValue(errorConIssues);

      await userTypeController.saveType(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Hubo un error",
        errors: ["Issue 1", "Issue 2"],
      });
    });
  });

  describe("getTypes", () => {
    it("debería retornar los tipos de usuarios exitosamente", async () => {
      const tiposSimulados = [
        {
          typeId: 1,
          name: "Administrador",
          permissionLevel: 10,
          active: true,
        },
        {
          typeId: 2,
          name: "Gerente",
          permissionLevel: 8,
          active: true,
        },
        {
          typeId: 3,
          name: "Cajero",
          permissionLevel: 3,
          active: true,
        },
      ];

      mockService.getAll.mockResolvedValue(tiposSimulados);

      await userTypeController.getTypes(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "sucess",
        message: "Tipos de usuarios obtenidos exitosamente",
        data: tiposSimulados,
      });
      expect(console.log).toHaveBeenCalledWith("Tipos de usuarios obtenidos exitosamente");
    });

    it("debería manejar errores al obtener los tipos de usuarios", async () => {
      const mensajeError = "Error de conexión a la base de datos";
      mockService.getAll.mockRejectedValue(new Error(mensajeError));

      await userTypeController.getTypes(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Hubo un error al obtener los datos: ${mensajeError}`,
      });
      expect(console.log).not.toHaveBeenCalledWith("Tipos de usuarios obtenidos exitosamente");
    });

    it("debería manejar errores sin mensaje específico", async () => {
      const errorSinMensaje = {};
      mockService.getAll.mockRejectedValue(errorSinMensaje);

      await userTypeController.getTypes(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Hubo un error al obtener los datos: undefined",
      });
    });

    it("debería retornar un array vacío cuando no hay tipos de usuarios", async () => {
      const tiposVacios: any[] = [];

      mockService.getAll.mockResolvedValue(tiposVacios);

      await userTypeController.getTypes(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "sucess",
        message: "Tipos de usuarios obtenidos exitosamente",
        data: tiposVacios,
      });
      expect(console.log).toHaveBeenCalledWith("Tipos de usuarios obtenidos exitosamente");
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

      expect(() => userTypeController.setService(nuevoServicio)).not.toThrow();

      // Verificar que el servicio se estableció correctamente
      nuevoServicio.getAll.mockResolvedValue([]);
      await userTypeController.getTypes(mockReq, mockRes);

      expect(nuevoServicio.getAll).toHaveBeenCalled();
    });
  });

  describe("Casos límite de validación", () => {
    it("debería manejar name con exactamente 4 caracteres", async () => {
      const datosMinimos = {
        name: "Test", // Exactamente 4 caracteres
        permissionLevel: "1",
      };

      const datosValidados = {
        name: "Test",
        permissionLevel: 1,
      };

      const tipoGuardado = { 
        typeId: 1, 
        ...datosValidados,
        active: true 
      };

      mockReq.body = datosMinimos;
      mockedUserTypeSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(tipoGuardado);

      await userTypeController.saveType(mockReq, mockRes);

      expect(mockedUserTypeSchema.parse).toHaveBeenCalledWith(datosMinimos);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("debería manejar name con exactamente 50 caracteres", async () => {
      const nameMaximo = "a".repeat(50); // Exactamente 50 caracteres
      const datosMaximos = {
        name: nameMaximo,
        permissionLevel: "5",
      };

      const datosValidados = {
        name: nameMaximo,
        permissionLevel: 5,
      };

      const tipoGuardado = { 
        typeId: 1, 
        ...datosValidados,
        active: true 
      };

      mockReq.body = datosMaximos;
      mockedUserTypeSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(tipoGuardado);

      await userTypeController.saveType(mockReq, mockRes);

      expect(mockedUserTypeSchema.parse).toHaveBeenCalledWith(datosMaximos);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("debería manejar permissionLevel con valor 0", async () => {
      const datosConCero = {
        name: "Invitado",
        permissionLevel: "0", // Valor mínimo permitido
      };

      const datosValidados = {
        name: "Invitado",
        permissionLevel: 0,
      };

      const tipoGuardado = { 
        typeId: 1, 
        ...datosValidados,
        active: true 
      };

      mockReq.body = datosConCero;
      mockedUserTypeSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(tipoGuardado);

      await userTypeController.saveType(mockReq, mockRes);

      expect(mockedUserTypeSchema.parse).toHaveBeenCalledWith(datosConCero);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe("Casos con diferentes niveles de permisos", () => {
    const nivelesDePermiso = [
      { input: "0", expected: 0, tipo: "Invitado" },
      { input: "1", expected: 1, tipo: "Usuario Básico" },
      { input: "5", expected: 5, tipo: "Empleado" },
      { input: "8", expected: 8, tipo: "Supervisor" },
      { input: "10", expected: 10, tipo: "Administrador" },
      { input: "999", expected: 999, tipo: "Super Admin" },
    ];

    nivelesDePermiso.forEach(({ input, expected, tipo }) => {
      it(`debería transformar permissionLevel "${input}" a ${expected} para tipo "${tipo}"`, async () => {
        const datosTipo = {
          name: tipo,
          permissionLevel: input,
        };

        const datosValidados = {
          name: tipo,
          permissionLevel: expected,
        };

        const tipoGuardado = { 
          typeId: 1, 
          ...datosValidados,
          active: true 
        };

        mockReq.body = datosTipo;
        mockedUserTypeSchema.parse.mockReturnValue(datosValidados);
        mockService.save.mockResolvedValue(tipoGuardado);

        await userTypeController.saveType(mockReq, mockRes);

        expect(mockedUserTypeSchema.parse).toHaveBeenCalledWith(datosTipo);
        expect(mockService.save).toHaveBeenCalledWith(datosValidados);
        expect(mockRes.status).toHaveBeenCalledWith(201);
      });
    });
  });

  describe("Casos con nombres de tipos realistas", () => {
    const tiposRealistas = [
      { name: "Administrador General", permissionLevel: "10" },
      { name: "Gerente de Tienda", permissionLevel: "8" },
      { name: "Supervisor de Turno", permissionLevel: "6" },
      { name: "Cajero Principal", permissionLevel: "4" },
      { name: "Cajero", permissionLevel: "3" },
      { name: "Asistente", permissionLevel: "2" },
      { name: "Becario", permissionLevel: "1" },
      { name: "Invitado", permissionLevel: "0" },
    ];

    tiposRealistas.forEach((tipoDatos) => {
      it(`debería guardar el tipo "${tipoDatos.name}" con nivel ${tipoDatos.permissionLevel}`, async () => {
        const datosValidados = {
          name: tipoDatos.name,
          permissionLevel: parseInt(tipoDatos.permissionLevel),
        };

        const tipoGuardado = { 
          typeId: 1, 
          ...datosValidados,
          active: true 
        };

        mockReq.body = tipoDatos;
        mockedUserTypeSchema.parse.mockReturnValue(datosValidados);
        mockService.save.mockResolvedValue(tipoGuardado);

        await userTypeController.saveType(mockReq, mockRes);

        expect(mockedUserTypeSchema.parse).toHaveBeenCalledWith(tipoDatos);
        expect(mockService.save).toHaveBeenCalledWith(datosValidados);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.send).toHaveBeenCalledWith({
          status: "sucess",
          message: "El tipo de usuario fue registrado correctamente",
          data: tipoGuardado,
        });
      });
    });
  });
});
