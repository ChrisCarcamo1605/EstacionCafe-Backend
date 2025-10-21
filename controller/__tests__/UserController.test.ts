import * as userController from "../UserController";
import { IService } from "../../core/interfaces/IService";
import { userSchema } from "../../application/validations/UserValidations";

jest.mock("../../application/validations/UserValidations");
const mockedUserSchema = userSchema as jest.Mocked<typeof userSchema>;

describe("UserController", () => {
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
    userController.setService(mockService);

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

  describe("saveUser", () => {
    it("debería guardar el usuario exitosamente", async () => {
      const datosUsuario = {
        username: "johndoe",
        password: "MyPassword123!",
        typeId: "1",
        email: "john.doe@example.com",
      };

      const datosValidados = {
        username: "johndoe",
        password: "MyPassword123!",
        typeId: 1,
        email: "john.doe@example.com",
      };

      const usuarioGuardado = { 
        userId: 1, 
        ...datosValidados,
        active: true 
      };

      mockReq.body = datosUsuario;
      mockedUserSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(usuarioGuardado);

      await userController.saveUser(mockReq, mockRes);

      expect(mockedUserSchema.parse).toHaveBeenCalledWith(datosUsuario);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "sucess",
        message: "El usuario fue registrado correctamente",
        data: usuarioGuardado,
      });
      expect(console.log).toHaveBeenCalledWith("Usuario guardado correctamente");
    });

    it("debería manejar errores de validación ZodError para username muy corto", async () => {
      const datosInvalidos = {
        username: "abc", // Menos de 5 caracteres
        password: "MyPassword123!",
        typeId: "1",
        email: "john.doe@example.com",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "String must contain at least 5 character(s)",
            path: ["username"],
            code: "too_small",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedUserSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await userController.saveUser(mockReq, mockRes);

      expect(mockedUserSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: String must contain at least 5 character(s)",
        campo: ["username"],
        error: "too_small",
      });
      expect(console.log).not.toHaveBeenCalledWith("Usuario guardado correctamente");
    });

    it("debería manejar errores de validación ZodError para username muy largo", async () => {
      const nombreMuyLargo = "a".repeat(26); // Más de 25 caracteres
      const datosInvalidos = {
        username: nombreMuyLargo,
        password: "MyPassword123!",
        typeId: "1",
        email: "john.doe@example.com",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "String must contain at most 25 character(s)",
            path: ["username"],
            code: "too_big",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedUserSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await userController.saveUser(mockReq, mockRes);

      expect(mockedUserSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: String must contain at most 25 character(s)",
        campo: ["username"],
        error: "too_big",
      });
    });

    it("debería manejar errores de validación ZodError para password muy corta", async () => {
      const datosInvalidos = {
        username: "johndoe",
        password: "Pass1!", // Menos de 8 caracteres
        typeId: "1",
        email: "john.doe@example.com",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "String must contain at least 8 character(s)",
            path: ["password"],
            code: "too_small",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedUserSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await userController.saveUser(mockReq, mockRes);

      expect(mockedUserSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: String must contain at least 8 character(s)",
        campo: ["password"],
        error: "too_small",
      });
    });

    it("debería manejar errores de validación ZodError para password con formato inválido", async () => {
      const datosInvalidos = {
        username: "johndoe",
        password: "password123", // Sin mayúscula ni carácter especial
        typeId: "1",
        email: "john.doe@example.com",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial",
            path: ["password"],
            code: "custom",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedUserSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await userController.saveUser(mockReq, mockRes);

      expect(mockedUserSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial",
        campo: ["password"],
        error: "custom",
      });
    });

    it("debería manejar errores de validación ZodError para typeId inválido", async () => {
      const datosInvalidos = {
        username: "johndoe",
        password: "MyPassword123!",
        typeId: "invalid",
        email: "john.doe@example.com",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "Ingrese un id de UserTypeId valido",
            path: ["typeId"],
            code: "custom",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedUserSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await userController.saveUser(mockReq, mockRes);

      expect(mockedUserSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: Ingrese un id de UserTypeId valido",
        campo: ["typeId"],
        error: "custom",
      });
    });

    it("debería manejar errores de validación ZodError para email inválido", async () => {
      const datosInvalidos = {
        username: "johndoe",
        password: "MyPassword123!",
        typeId: "1",
        email: "email-invalido",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "Invalid email",
            path: ["email"],
            code: "invalid_string",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedUserSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await userController.saveUser(mockReq, mockRes);

      expect(mockedUserSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: Invalid email",
        campo: ["email"],
        error: "invalid_string",
      });
    });

    it("debería manejar errores de validación ZodError para email muy largo", async () => {
      const emailMuyLargo = "a".repeat(90) + "@email.com"; // Más de 100 caracteres
      const datosInvalidos = {
        username: "johndoe",
        password: "MyPassword123!",
        typeId: "1",
        email: emailMuyLargo,
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El email no puede exceder 100 caracteres",
            path: ["email"],
            code: "too_big",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedUserSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await userController.saveUser(mockReq, mockRes);

      expect(mockedUserSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El email no puede exceder 100 caracteres",
        campo: ["email"],
        error: "too_big",
      });
    });

    it("debería manejar errores generales del servidor", async () => {
      const datosUsuario = {
        username: "johndoe",
        password: "MyPassword123!",
        typeId: "1",
        email: "john.doe@example.com",
      };

      const datosValidados = {
        username: "johndoe",
        password: "MyPassword123!",
        typeId: 1,
        email: "john.doe@example.com",
      };

      const errorServidor = new Error("Error interno del servidor");

      mockReq.body = datosUsuario;
      mockedUserSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockRejectedValue(errorServidor);

      await userController.saveUser(mockReq, mockRes);

      expect(mockedUserSchema.parse).toHaveBeenCalledWith(datosUsuario);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Hubo un error: Error interno del servidor",
        errors: undefined,
      });
      expect(console.log).toHaveBeenCalledWith(errorServidor);
      expect(console.log).not.toHaveBeenCalledWith("Usuario guardado correctamente");
    });

    it("debería manejar errores con propiedades errors", async () => {
      const datosUsuario = {
        username: "johndoe",
        password: "MyPassword123!",
        typeId: "1",
        email: "john.doe@example.com",
      };

      const datosValidados = {
        username: "johndoe",
        password: "MyPassword123!",
        typeId: 1,
        email: "john.doe@example.com",
      };

      const errorConErrors = {
        message: "Error con errores",
        errors: ["Error 1", "Error 2"],
      };

      mockReq.body = datosUsuario;
      mockedUserSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockRejectedValue(errorConErrors);

      await userController.saveUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Hubo un error: Error con errores",
        errors: ["Error 1", "Error 2"],
      });
    });

    it("debería manejar errores con propiedades issues", async () => {
      const datosUsuario = {
        username: "johndoe",
        password: "MyPassword123!",
        typeId: "1",
        email: "john.doe@example.com",
      };

      const datosValidados = {
        username: "johndoe",
        password: "MyPassword123!",
        typeId: 1,
        email: "john.doe@example.com",
      };

      const errorConIssues = {
        message: "Error con issues",
        issues: ["Issue 1", "Issue 2"],
      };

      mockReq.body = datosUsuario;
      mockedUserSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockRejectedValue(errorConIssues);

      await userController.saveUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Hubo un error: Error con issues",
        errors: ["Issue 1", "Issue 2"],
      });
    });

    it("debería manejar transformaciones de string a number en typeId", async () => {
      const datosUsuario = {
        username: "janedoe",
        password: "SecurePass123!",
        typeId: "2", // String que se transforma a number
        email: "jane.doe@example.com",
      };

      const datosValidados = {
        username: "janedoe",
        password: "SecurePass123!",
        typeId: 2, // Transformado a number
        email: "jane.doe@example.com",
      };

      const usuarioGuardado = { 
        userId: 2, 
        ...datosValidados,
        active: true 
      };

      mockReq.body = datosUsuario;
      mockedUserSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(usuarioGuardado);

      await userController.saveUser(mockReq, mockRes);

      expect(mockedUserSchema.parse).toHaveBeenCalledWith(datosUsuario);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("debería manejar username y email con espacios (trim)", async () => {
      const datosConEspacios = {
        username: "   johndoe   ",
        password: "MyPassword123!",
        typeId: "1",
        email: "   john.doe@example.com   ",
      };

      const datosLimpios = {
        username: "johndoe",
        password: "MyPassword123!",
        typeId: 1,
        email: "john.doe@example.com",
      };

      const usuarioGuardado = { 
        userId: 1, 
        ...datosLimpios,
        active: true 
      };

      mockReq.body = datosConEspacios;
      mockedUserSchema.parse.mockReturnValue(datosLimpios);
      mockService.save.mockResolvedValue(usuarioGuardado);

      await userController.saveUser(mockReq, mockRes);

      expect(mockedUserSchema.parse).toHaveBeenCalledWith(datosConEspacios);
      expect(mockService.save).toHaveBeenCalledWith(datosLimpios);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe("getUsers", () => {
    it("debería retornar los usuarios exitosamente", async () => {
      const usuariosSimulados = [
        {
          userId: 1,
          username: "johndoe",
          typeId: 1,
          email: "john.doe@example.com",
          active: true,
        },
        {
          userId: 2,
          username: "janedoe",
          typeId: 2,
          email: "jane.doe@example.com",
          active: true,
        },
      ];

      mockService.getAll.mockResolvedValue(usuariosSimulados);

      await userController.getUsers(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "sucess",
        message: "Usuarios obtenidos correctamente",
        data: usuariosSimulados,
      });
      expect(console.log).toHaveBeenCalledWith("Usuarios obtenidos correctamente");
    });

    it("debería manejar errores al obtener los usuarios", async () => {
      const mensajeError = "Error de conexión a la base de datos";
      mockService.getAll.mockRejectedValue(new Error(mensajeError));

      await userController.getUsers(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Hubo un error al obtener los datos:\n${mensajeError}`,
      });
      expect(console.log).not.toHaveBeenCalledWith("Usuarios obtenidos correctamente");
    });

    it("debería manejar errores sin mensaje específico", async () => {
      const errorSinMensaje = {};
      mockService.getAll.mockRejectedValue(errorSinMensaje);

      await userController.getUsers(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Hubo un error al obtener los datos:\nundefined",
      });
    });

    it("debería retornar un array vacío cuando no hay usuarios", async () => {
      const usuariosVacios: any[] = [];

      mockService.getAll.mockResolvedValue(usuariosVacios);

      await userController.getUsers(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "sucess",
        message: "Usuarios obtenidos correctamente",
        data: usuariosVacios,
      });
      expect(console.log).toHaveBeenCalledWith("Usuarios obtenidos correctamente");
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

      expect(() => userController.setService(nuevoServicio)).not.toThrow();

      // Verificar que el servicio se estableció correctamente
      nuevoServicio.getAll.mockResolvedValue([]);
      await userController.getUsers(mockReq, mockRes);

      expect(nuevoServicio.getAll).toHaveBeenCalled();
    });
  });

  describe("Casos con diferentes tipos de contraseñas válidas", () => {
    const contrasenasValidas = [
      "Password123!",
      "MySecure@Pass1",
      "Test$Password9",
      "Valid&Pass123",
      "Strong#123Pass",
      "Secure*Pass456",
    ];

    contrasenasValidas.forEach((password) => {
      it(`debería aceptar contraseña válida: "${password}"`, async () => {
        const datosUsuario = {
          username: "testuser",
          password: password,
          typeId: "1",
          email: "test@example.com",
        };

        const datosValidados = {
          username: "testuser",
          password: password,
          typeId: 1,
          email: "test@example.com",
        };

        const usuarioGuardado = { 
          userId: 1, 
          ...datosValidados,
          active: true 
        };

        mockReq.body = datosUsuario;
        mockedUserSchema.parse.mockReturnValue(datosValidados);
        mockService.save.mockResolvedValue(usuarioGuardado);

        await userController.saveUser(mockReq, mockRes);

        expect(mockedUserSchema.parse).toHaveBeenCalledWith(datosUsuario);
        expect(mockService.save).toHaveBeenCalledWith(datosValidados);
        expect(mockRes.status).toHaveBeenCalledWith(201);
      });
    });
  });

  describe("Casos límite de validación", () => {
    it("debería manejar username con exactamente 5 caracteres", async () => {
      const datosMinimos = {
        username: "user1", // Exactamente 5 caracteres
        password: "MinPass123!",
        typeId: "1",
        email: "min@test.com",
      };

      const datosValidados = {
        username: "user1",
        password: "MinPass123!",
        typeId: 1,
        email: "min@test.com",
      };

      const usuarioGuardado = { 
        userId: 1, 
        ...datosValidados,
        active: true 
      };

      mockReq.body = datosMinimos;
      mockedUserSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(usuarioGuardado);

      await userController.saveUser(mockReq, mockRes);

      expect(mockedUserSchema.parse).toHaveBeenCalledWith(datosMinimos);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("debería manejar username con exactamente 25 caracteres", async () => {
      const usernameMaximo = "a".repeat(25); // Exactamente 25 caracteres
      const datosMaximos = {
        username: usernameMaximo,
        password: "MaxPass123!",
        typeId: "1",
        email: "max@test.com",
      };

      const datosValidados = {
        username: usernameMaximo,
        password: "MaxPass123!",
        typeId: 1,
        email: "max@test.com",
      };

      const usuarioGuardado = { 
        userId: 1, 
        ...datosValidados,
        active: true 
      };

      mockReq.body = datosMaximos;
      mockedUserSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(usuarioGuardado);

      await userController.saveUser(mockReq, mockRes);

      expect(mockedUserSchema.parse).toHaveBeenCalledWith(datosMaximos);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("debería manejar password con exactamente 8 caracteres", async () => {
      const datosMinimos = {
        username: "testuser",
        password: "MinP@ss1", // Exactamente 8 caracteres
        typeId: "1",
        email: "test@example.com",
      };

      const datosValidados = {
        username: "testuser",
        password: "MinP@ss1",
        typeId: 1,
        email: "test@example.com",
      };

      const usuarioGuardado = { 
        userId: 1, 
        ...datosValidados,
        active: true 
      };

      mockReq.body = datosMinimos;
      mockedUserSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(usuarioGuardado);

      await userController.saveUser(mockReq, mockRes);

      expect(mockedUserSchema.parse).toHaveBeenCalledWith(datosMinimos);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("debería manejar email con exactamente 100 caracteres", async () => {
      const emailMaximo = "a".repeat(85) + "@example.com"; // Exactamente 100 caracteres
      const datosMaximos = {
        username: "testuser",
        password: "TestPass123!",
        typeId: "1",
        email: emailMaximo,
      };

      const datosValidados = {
        username: "testuser",
        password: "TestPass123!",
        typeId: 1,
        email: emailMaximo,
      };

      const usuarioGuardado = { 
        userId: 1, 
        ...datosValidados,
        active: true 
      };

      mockReq.body = datosMaximos;
      mockedUserSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(usuarioGuardado);

      await userController.saveUser(mockReq, mockRes);

      expect(mockedUserSchema.parse).toHaveBeenCalledWith(datosMaximos);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe("Casos con diferentes typeId", () => {
    const tiposDeUsuario = [
      { input: "1", expected: 1 },
      { input: "2", expected: 2 },
      { input: "10", expected: 10 },
      { input: "999", expected: 999 },
    ];

    tiposDeUsuario.forEach(({ input, expected }) => {
      it(`debería transformar typeId "${input}" a ${expected}`, async () => {
        const datosUsuario = {
          username: "testuser",
          password: "TestPass123!",
          typeId: input,
          email: "test@example.com",
        };

        const datosValidados = {
          username: "testuser",
          password: "TestPass123!",
          typeId: expected,
          email: "test@example.com",
        };

        const usuarioGuardado = { 
          userId: 1, 
          ...datosValidados,
          active: true 
        };

        mockReq.body = datosUsuario;
        mockedUserSchema.parse.mockReturnValue(datosValidados);
        mockService.save.mockResolvedValue(usuarioGuardado);

        await userController.saveUser(mockReq, mockRes);

        expect(mockedUserSchema.parse).toHaveBeenCalledWith(datosUsuario);
        expect(mockService.save).toHaveBeenCalledWith(datosValidados);
        expect(mockRes.status).toHaveBeenCalledWith(201);
      });
    });
  });
});
