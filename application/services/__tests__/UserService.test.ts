import { Repository } from "typeorm";
import { UserService } from "../UserService";
import { User } from "../../../core/entities/User";
import { SaveUserDTO } from "../../DTOs/UserDTO";
import * as bcrypt from "bcrypt";

// Mock de bcrypt
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

describe("UserService", () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<Repository<User>>;
  let mockBcryptHash: jest.MockedFunction<typeof bcrypt.hash>;

  beforeEach(() => {
    // Setup bcrypt mock
    mockBcryptHash = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;
    
    // Crear mock del repositorio
    mockRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    } as any;

    // Crear instancia del servicio con el repositorio mock
    userService = new UserService(mockRepository);

    // Limpiar console.log
    jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("save", () => {
    it("debería guardar un usuario con contraseña encriptada", async () => {
      const userData: SaveUserDTO = {
        username: "johndoe",
        password: "MyPassword123!",
        typeId: 1,
        email: "john.doe@example.com",
      };

      const hashedPassword = "hashed_password_123";
      const savedUser = {
        userId: 1,
        username: "johndoe",
        password: hashedPassword,
        userTypeId: 1,
        email: "john.doe@example.com",
        active: true,
      } as User;

      mockBcryptHash.mockResolvedValue(hashedPassword as never);
      mockRepository.save.mockResolvedValue(savedUser);

      const result = await userService.save(userData);

      expect(mockBcryptHash).toHaveBeenCalledWith("MyPassword123!", 10);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          username: "johndoe",
          password: hashedPassword,
          userTypeId: 1,
          email: "john.doe@example.com",
        })
      );
      expect(result).toEqual(savedUser);
      expect(console.log).toHaveBeenCalledWith("Guardando usuario...");
    });

    it("debería manejar errores durante la encriptación", async () => {
      const userData: SaveUserDTO = {
        username: "johndoe",
        password: "MyPassword123!",
        typeId: 1,
        email: "john.doe@example.com",
      };

      const encryptionError = new Error("Error de encriptación");
      mockBcryptHash.mockRejectedValue(encryptionError as never);

      await expect(userService.save(userData)).rejects.toThrow("Error de encriptación");
      expect(mockBcryptHash).toHaveBeenCalledWith("MyPassword123!", 10);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it("debería manejar errores del repositorio", async () => {
      const userData: SaveUserDTO = {
        username: "johndoe",
        password: "MyPassword123!",
        typeId: 1,
        email: "john.doe@example.com",
      };

      const hashedPassword = "hashed_password_123";
      const repositoryError = new Error("Error de base de datos");

      mockBcryptHash.mockResolvedValue(hashedPassword as never);
      mockRepository.save.mockRejectedValue(repositoryError);

      await expect(userService.save(userData)).rejects.toThrow("Error de base de datos");
      expect(mockBcryptHash).toHaveBeenCalledWith("MyPassword123!", 10);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it("debería usar el número correcto de salt rounds", async () => {
      const userData: SaveUserDTO = {
        username: "testuser",
        password: "TestPass123!",
        typeId: 2,
        email: "test@example.com",
      };

      mockBcryptHash.mockResolvedValue("hashed_password" as never);
      mockRepository.save.mockResolvedValue({} as User);

      await userService.save(userData);

      expect(mockBcryptHash).toHaveBeenCalledWith("TestPass123!", 10);
    });

    it("debería crear una entidad User con los datos correctos", async () => {
      const userData: SaveUserDTO = {
        username: "janedoe",
        password: "SecurePass456!",
        typeId: 3,
        email: "jane@example.com",
      };

      const hashedPassword = "super_secure_hash";
      mockBcryptHash.mockResolvedValue(hashedPassword as never);
      mockRepository.save.mockResolvedValue({} as User);

      await userService.save(userData);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          username: "janedoe",
          password: hashedPassword,
          userTypeId: 3,
          email: "jane@example.com",
        })
      );
    });

    it("debería manejar contraseñas con caracteres especiales", async () => {
      const userData: SaveUserDTO = {
        username: "specialuser",
        password: "P@$$w0rd!#$%^&*()",
        typeId: 1,
        email: "special@example.com",
      };

      const hashedPassword = "hashed_special_password";
      mockBcryptHash.mockResolvedValue(hashedPassword as never);
      mockRepository.save.mockResolvedValue({} as User);

      await userService.save(userData);

      expect(mockBcryptHash).toHaveBeenCalledWith("P@$$w0rd!#$%^&*()", 10);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          password: hashedPassword,
        })
      );
    });
  });

  describe("getAll", () => {
    it("debería obtener todos los usuarios con relaciones", async () => {
      const mockUsers = [
        {
          userId: 1,
          username: "johndoe",
          email: "john@example.com",
          password: "hashed",
          userTypeId: 1,
          active: true,
        },
        {
          userId: 2,
          username: "janedoe",
          email: "jane@example.com",
          password: "hashed",
          userTypeId: 2,
          active: true,
        },
      ] as User[];

      mockRepository.find.mockResolvedValue(mockUsers);

      const result = await userService.getAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ["userType"],
      });
      expect(result).toEqual(mockUsers);
      expect(console.log).toHaveBeenCalledWith("Obteniendo usuarios...");
    });

    it("debería retornar array vacío cuando no hay usuarios", async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await userService.getAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ["userType"],
      });
      expect(result).toEqual([]);
      expect(console.log).toHaveBeenCalledWith("Obteniendo usuarios...");
    });

    it("debería manejar errores del repositorio", async () => {
      const repositoryError = new Error("Error de conexión a la base de datos");
      mockRepository.find.mockRejectedValue(repositoryError);

      await expect(userService.getAll()).rejects.toThrow("Error de conexión a la base de datos");
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ["userType"],
      });
    });
  });

 

  describe("encryptPassword (método privado)", () => {
    it("debería usar bcrypt con la configuración correcta", async () => {
      const userData: SaveUserDTO = {
        username: "testuser",
        password: "TestPassword123!",
        typeId: 1,
        email: "test@example.com",
      };

      const hashedPassword = "hashed_test_password";
      mockBcryptHash.mockResolvedValue(hashedPassword as never);
      mockRepository.save.mockResolvedValue({} as User);

      await userService.save(userData);

      expect(mockBcryptHash).toHaveBeenCalledWith("TestPassword123!", 10);
      expect(mockBcryptHash).toHaveBeenCalledTimes(1);
    });
  });

  describe("Casos de integración", () => {
    it("debería procesar múltiples operaciones de guardado secuenciales", async () => {
      const users: SaveUserDTO[] = [
        {
          username: "user1",
          password: "Pass1!",
          typeId: 1,
          email: "user1@example.com",
        },
        {
          username: "user2",
          password: "Pass2!",
          typeId: 2,
          email: "user2@example.com",
        },
      ];

      mockBcryptHash
        .mockResolvedValueOnce("hash1" as never)
        .mockResolvedValueOnce("hash2" as never);
      
      mockRepository.save
        .mockResolvedValueOnce({ userId: 1 } as User)
        .mockResolvedValueOnce({ userId: 2 } as User);

      const results = await Promise.all(users.map(user => userService.save(user)));

      expect(results).toHaveLength(2);
      expect(mockBcryptHash).toHaveBeenCalledTimes(2);
      expect(mockRepository.save).toHaveBeenCalledTimes(2);
    });

    it("debería manejar correctamente la creación de entidades User", async () => {
      const userData: SaveUserDTO = {
        username: "testuser",
        password: "TestPass123!",
        typeId: 1,
        email: "test@example.com",
      };

      mockBcryptHash.mockResolvedValue("hashed_password" as never);
      
      let savedUserEntity: any;
      mockRepository.save.mockImplementation((user) => {
        savedUserEntity = user;
        return Promise.resolve({ userId: 1, ...user } as User);
      });

      await userService.save(userData);

      expect(savedUserEntity).toBeInstanceOf(User);
      expect(savedUserEntity.username).toBe("testuser");
      expect(savedUserEntity.password).toBe("hashed_password");
      expect(savedUserEntity.userTypeId).toBe(1);
      expect(savedUserEntity.email).toBe("test@example.com");
    });
  });

  describe("Validaciones de tipos", () => {
    it("debería manejar diferentes tipos de typeId", async () => {
      const userData: SaveUserDTO = {
        username: "testuser",
        password: "TestPass123!",
        typeId: 999,
        email: "test@example.com",
      };

      mockBcryptHash.mockResolvedValue("hashed_password" as never);
      mockRepository.save.mockResolvedValue({} as User);

      await userService.save(userData);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          userTypeId: 999,
        })
      );
    });

    it("debería preservar emails con diferentes formatos válidos", async () => {
      const emails = [
        "simple@example.com",
        "test.email+tag@domain.co.uk", 
        "user123@subdomain.example.org",
      ];

      for (const email of emails) {
        const userData: SaveUserDTO = {
          username: `user_${email.split('@')[0]}`,
          password: "TestPass123!",
          typeId: 1,
          email: email,
        };

        mockBcryptHash.mockResolvedValue("hashed_password" as never);
        mockRepository.save.mockResolvedValue({} as User);

        await userService.save(userData);

        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            email: email,
          })
        );
      }
    });
  });
});