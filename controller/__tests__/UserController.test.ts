import * as userController from "../UserController";
import { IService } from "../../core/interfaces/IService";

jest.mock("../../application/validations/UserValidations", () => ({
  createUserSchema: {
    parse: jest.fn(),
  },
  updateUserSchema: {
    parse: jest.fn(),
  },
  userIdSchema: {
    parse: jest.fn(),
  },
}));

const { createUserSchema, updateUserSchema, userIdSchema } = require("../../application/validations/UserValidations");

describe("UserController", () => {
  let mockService: jest.Mocked<IService>;
  let mockTokenService: any;
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

    // Crear el mock del token service
    mockTokenService = {
      generateToken: jest.fn(),
      verifyToken: jest.fn(),
    };

    // Establecer los servicios mock
    userController.setServices(mockService, mockTokenService);

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
        password: "Password123!",
        email: "john.doe@example.com",
        typeId: "1",
      };

      const datosValidados = {
        username: "johndoe",
        password: "Password123!",
        email: "john.doe@example.com",
        typeId: 1,
      };

      const usuarioGuardado = { userId: 1, ...datosValidados };

      mockReq.body = datosUsuario;
      createUserSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(usuarioGuardado);

      await userController.saveUser(mockReq, mockRes);

      expect(createUserSchema.parse).toHaveBeenCalledWith(datosUsuario);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "Usuario creado correctamente",
        data: usuarioGuardado,
      });
    });

    it("debería manejar errores de validación ZodError para username muy corto", async () => {
      const datosInvalidos = {
        username: "jo",
        password: "Password123!",
        email: "john.doe@example.com",
        typeId: "1",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El nombre de usuario debe tener al menos 3 caracteres",
            path: ["username"],
            code: "too_small",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      createUserSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await userController.saveUser(mockReq, mockRes);

      expect(createUserSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El nombre de usuario debe tener al menos 3 caracteres",
        campo: ["username"],
        error: "too_small",
      });
    });

    it("debería manejar errores de validación ZodError para username muy largo", async () => {
      const datosInvalidos = {
        username: "a".repeat(51), // 51 caracteres, excede el límite de 50
        password: "Password123!",
        email: "john.doe@example.com",
        typeId: "1",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El nombre de usuario es muy largo",
            path: ["username"],
            code: "too_big",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      createUserSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await userController.saveUser(mockReq, mockRes);

      expect(createUserSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El nombre de usuario es muy largo",
        campo: ["username"],
        error: "too_big",
      });
    });

    it("debería manejar errores de validación ZodError para password muy corta", async () => {
      const datosInvalidos = {
        username: "johndoe",
        password: "123",
        email: "john.doe@example.com",
        typeId: "1",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "La contraseña debe tener al menos 6 caracteres",
            path: ["password"],
            code: "too_small",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      createUserSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await userController.saveUser(mockReq, mockRes);

      expect(createUserSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: La contraseña debe tener al menos 6 caracteres",
        campo: ["password"],
        error: "too_small",
      });
    });

    it("debería manejar errores de validación ZodError para password muy larga", async () => {
      const datosInvalidos = {
        username: "johndoe",
        password: "a".repeat(101), // 101 caracteres, excede el límite de 100
        email: "john.doe@example.com",
        typeId: "1",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "La contraseña es muy larga",
            path: ["password"],
            code: "too_big",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      createUserSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await userController.saveUser(mockReq, mockRes);

      expect(createUserSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: La contraseña es muy larga",
        campo: ["password"],
        error: "too_big",
      });
    });

    it("debería manejar errores de validación ZodError para email inválido", async () => {
      const datosInvalidos = {
        username: "johndoe",
        password: "Password123!",
        email: "invalid-email",
        typeId: "1",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "Debe ser un email válido",
            path: ["email"],
            code: "invalid_string",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      createUserSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await userController.saveUser(mockReq, mockRes);

      expect(createUserSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: Debe ser un email válido",
        campo: ["email"],
        error: "invalid_string",
      });
    });

    it("debería manejar errores generales del servidor", async () => {
      const datosUsuario = {
        username: "johndoe",
        password: "Password123!",
        email: "john.doe@example.com",
        typeId: "1",
      };
      const datosValidados = {
        username: "johndoe",
        password: "Password123!",
        email: "john.doe@example.com",
        typeId: 1,
      };
      const errorServidor = new Error("Error interno del servidor");

      mockReq.body = datosUsuario;
      createUserSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockRejectedValue(errorServidor);

      await userController.saveUser(mockReq, mockRes);

      expect(createUserSchema.parse).toHaveBeenCalledWith(datosUsuario);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Error interno del servidor: Error interno del servidor",
      });
      expect(console.error).toHaveBeenCalledWith(
        "Error al crear usuario:",
        errorServidor
      );
    });

    it("debería manejar transformaciones de string a number en typeId", async () => {
      const datosUsuario = {
        username: "johndoe",
        password: "Password123!",
        email: "john.doe@example.com",
        typeId: "2", // String que debe transformarse a number
      };
      const datosValidados = {
        username: "johndoe",
        password: "Password123!",
        email: "john.doe@example.com",
        typeId: 2, // Number transformado
      };
      const usuarioGuardado = { userId: 1, ...datosValidados };

      mockReq.body = datosUsuario;
      createUserSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(usuarioGuardado);

      await userController.saveUser(mockReq, mockRes);

      expect(createUserSchema.parse).toHaveBeenCalledWith(datosUsuario);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "Usuario creado correctamente",
        data: usuarioGuardado,
      });
    });

    it("debería manejar username y email con espacios (trim y toLowerCase)", async () => {
      const datosConEspacios = {
        username: "  johndoe  ",
        password: "Password123!",
        email: "  JOHN.DOE@EXAMPLE.COM  ",
        typeId: "1",
      };
      const datosLimpios = {
        username: "johndoe",
        password: "Password123!",
        email: "john.doe@example.com",
        typeId: 1,
      };
      const usuarioGuardado = { userId: 1, ...datosLimpios };

      mockReq.body = datosConEspacios;
      createUserSchema.parse.mockReturnValue(datosLimpios);
      mockService.save.mockResolvedValue(usuarioGuardado);

      await userController.saveUser(mockReq, mockRes);

      expect(createUserSchema.parse).toHaveBeenCalledWith(datosConEspacios);
      expect(mockService.save).toHaveBeenCalledWith(datosLimpios);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "Usuario creado correctamente",
        data: usuarioGuardado,
      });
    });
  });

  describe("getUsers", () => {
    it("debería retornar los usuarios exitosamente", async () => {
      const usuariosSimulados = [
        {
          userId: 1,
          username: "johndoe",
          email: "john.doe@example.com",
          typeId: 1,
          active: true,
        },
        {
          userId: 2,
          username: "janedoe",
          email: "jane.doe@example.com",
          typeId: 2,
          active: true,
        },
      ];

      mockService.getAll.mockResolvedValue(usuariosSimulados);

      await userController.getUsers(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        body: usuariosSimulados,
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
        message: `Error al obtener los usuarios: ${mensajeError}`,
      });
    });

    it("debería manejar errores sin mensaje específico", async () => {
      const errorSinMensaje = {};
      mockService.getAll.mockRejectedValue(errorSinMensaje);

      await userController.getUsers(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Error al obtener los usuarios: undefined",
      });
    });

    it("debería retornar un array vacío cuando no hay usuarios", async () => {
      const usuariosVacios: any[] = [];

      mockService.getAll.mockResolvedValue(usuariosVacios);

      await userController.getUsers(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        body: usuariosVacios,
      });
    });
  });

  describe("getUserById", () => {
    it("debería obtener un usuario por ID exitosamente", async () => {
      const usuario = {
        userId: 1,
        username: "johndoe",
        email: "john.doe@example.com",
        typeId: 1,
        active: true,
      };

      mockReq.params = { id: "1" };
      
      userIdSchema.parse.mockReturnValue({ id: 1 });
      mockService.getById.mockResolvedValue(usuario);

      await userController.getUserById(mockReq, mockRes);

      expect(userIdSchema.parse).toHaveBeenCalledWith({ id: "1" });
      expect(mockService.getById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        body: usuario,
      });
      expect(console.log).toHaveBeenCalledWith("Usuario obtenido correctamente");
    });

    it("debería manejar errores de validación para ID inválido", async () => {
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
      
      userIdSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await userController.getUserById(mockReq, mockRes);

      expect(userIdSchema.parse).toHaveBeenCalledWith({ id: "invalid" });
      expect(mockService.getById).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "ID inválido: El ID debe ser un número positivo",
      });
    });

    it("debería manejar errores cuando el usuario no es encontrado", async () => {
      const errorNotFound = new Error("Usuario no encontrado");

      mockReq.params = { id: "999" };
      
      userIdSchema.parse.mockReturnValue({ id: 999 });
      mockService.getById.mockRejectedValue(errorNotFound);

      await userController.getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Usuario no encontrado",
      });
    });
  });

  describe("updateUser", () => {
    it("debería actualizar un usuario exitosamente", async () => {
      const updateData = {
        username: "johnupdated",
        email: "john.updated@example.com",
      };
      const updatedUser = { userId: 1, ...updateData };

      mockReq.params = { id: "1" };
      mockReq.body = updateData;
      
      userIdSchema.parse.mockReturnValue({ id: 1 });
      updateUserSchema.parse.mockReturnValue(updateData);
      mockService.update.mockResolvedValue(updatedUser);

      await userController.updateUser(mockReq, mockRes);

      expect(userIdSchema.parse).toHaveBeenCalledWith({ id: "1" });
      expect(updateUserSchema.parse).toHaveBeenCalledWith(updateData);
      expect(mockService.update).toHaveBeenCalledWith({
        userId: 1,
        ...updateData
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "Usuario actualizado correctamente",
        data: updatedUser,
      });
    });
  });

  describe("deleteUser", () => {
    it("debería eliminar un usuario exitosamente", async () => {
      const deletedUser = { userId: 1, deleted: true };

      mockReq.params = { id: "1" };
      
      userIdSchema.parse.mockReturnValue({ id: 1 });
      mockService.delete.mockResolvedValue(deletedUser);

      await userController.deleteUser(mockReq, mockRes);

      expect(userIdSchema.parse).toHaveBeenCalledWith({ id: "1" });
      expect(mockService.delete).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "Usuario eliminado correctamente",
        data: deletedUser,
      });
    });
  });

  describe("getUsersByType", () => {
    it("debería obtener usuarios por tipo exitosamente", async () => {
      const usuariosPorTipo = [
        {
          userId: 1,
          username: "admin",
          email: "admin@example.com",
          typeId: 1,
        },
      ];

      mockReq.params = { typeId: "1" };
      
      // Crear un mock específico para getUsersByType
      const mockUserService = mockService as any;
      mockUserService.getUsersByType = jest.fn().mockResolvedValue(usuariosPorTipo);

      await userController.getUsersByType(mockReq, mockRes);

      expect(mockUserService.getUsersByType).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        body: usuariosPorTipo,
      });
    });

    it("debería manejar errores al obtener usuarios por tipo", async () => {
      const mensajeError = "Error al obtener usuarios por tipo";
      const mockUserService = mockService as any;
      mockUserService.getUsersByType = jest.fn().mockRejectedValue(new Error(mensajeError));

      mockReq.params = { typeId: "1" };

      await userController.getUsersByType(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: `Error al obtener los usuarios por tipo: ${mensajeError}`,
      });
    });
  });

  describe("setServices", () => {
    it("debería establecer los servicios correctamente", async () => {
      const nuevoServicio = {
        getAll: jest.fn(),
        getById: jest.fn(),
        save: jest.fn(),
        saveAll: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
      } as any;

      const nuevoTokenService = {
        generateToken: jest.fn(),
        verifyToken: jest.fn(),
      };

      expect(() => userController.setServices(nuevoServicio, nuevoTokenService)).not.toThrow();

      // Verificar que el servicio se estableció correctamente
      nuevoServicio.getAll.mockResolvedValue([]);
      await userController.getUsers(mockReq, mockRes);

      expect(nuevoServicio.getAll).toHaveBeenCalled();
    });
  });

  describe("Casos límite de validación", () => {
    it("debería manejar username con exactamente 3 caracteres", async () => {
      const datosMinimos = {
        username: "abc", // Exactamente 3 caracteres
        password: "Password123!",
        email: "abc@example.com",
        typeId: "1",
      };

      const datosValidados = { ...datosMinimos, typeId: 1 };
      const usuarioGuardado = { userId: 1, ...datosValidados };

      mockReq.body = datosMinimos;
      createUserSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(usuarioGuardado);

      await userController.saveUser(mockReq, mockRes);

      expect(createUserSchema.parse).toHaveBeenCalledWith(datosMinimos);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("debería manejar username con exactamente 50 caracteres", async () => {
      const datosMaximos = {
        username: "a".repeat(50), // Exactamente 50 caracteres
        password: "Password123!",
        email: "test@example.com",
        typeId: "1",
      };

      const datosValidados = { ...datosMaximos, typeId: 1 };
      const usuarioGuardado = { userId: 1, ...datosValidados };

      mockReq.body = datosMaximos;
      createUserSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(usuarioGuardado);

      await userController.saveUser(mockReq, mockRes);

      expect(createUserSchema.parse).toHaveBeenCalledWith(datosMaximos);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("debería manejar password con exactamente 6 caracteres", async () => {
      const datosMinimos = {
        username: "johndoe",
        password: "Pass1!", // Exactamente 6 caracteres
        email: "john@example.com",
        typeId: "1",
      };

      const datosValidados = { ...datosMinimos, typeId: 1 };
      const usuarioGuardado = { userId: 1, ...datosValidados };

      mockReq.body = datosMinimos;
      createUserSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(usuarioGuardado);

      await userController.saveUser(mockReq, mockRes);

      expect(createUserSchema.parse).toHaveBeenCalledWith(datosMinimos);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe("Casos con diferentes typeId", () => {
    const tiposDeUsuario = [
      { typeIdString: "1", typeIdNumber: 1 },
      { typeIdString: "2", typeIdNumber: 2 },
      { typeIdString: "10", typeIdNumber: 10 },
      { typeIdString: "999", typeIdNumber: 999 },
    ];

    tiposDeUsuario.forEach(({ typeIdString, typeIdNumber }) => {
      it(`debería transformar typeId "${typeIdString}" a ${typeIdNumber}`, async () => {
        const datosUsuario = {
          username: "testuser",
          password: "Password123!",
          email: "test@example.com",
          typeId: typeIdString,
        };
        const datosValidados = { ...datosUsuario, typeId: typeIdNumber };
        const usuarioGuardado = { userId: 1, ...datosValidados };

        mockReq.body = datosUsuario;
        createUserSchema.parse.mockReturnValue(datosValidados);
        mockService.save.mockResolvedValue(usuarioGuardado);

        await userController.saveUser(mockReq, mockRes);

        expect(createUserSchema.parse).toHaveBeenCalledWith(datosUsuario);
        expect(mockService.save).toHaveBeenCalledWith(datosValidados);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.send).toHaveBeenCalledWith({
          message: "Usuario creado correctamente",
          data: usuarioGuardado,
        });
      });
    });
  });
});
