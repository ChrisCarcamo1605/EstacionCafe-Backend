import { Repository } from "typeorm";
import { CashRegisterService } from "../CashRegisterService";
import { CashRegister } from "../../../core/entities/CashRegister";
import { SaveCashRegisterDTO } from "../../DTOs/CashRegisterDTO";

describe("CashRegisterService", () => {
  let cashRegisterService: CashRegisterService;
  let mockRepository: jest.Mocked<Repository<CashRegister>>;

  beforeEach(() => {
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
    cashRegisterService = new CashRegisterService(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("save", () => {
    it("debería guardar una caja registradora exitosamente", async () => {
      const cashRegisterData: SaveCashRegisterDTO = {
        number: "CR-001",
        active: true,
      };

      const savedCashRegister = {
        cashRegisterId: 1,
        number: "CR-001",
        active: true,
      } as CashRegister;

      mockRepository.save.mockResolvedValue(savedCashRegister);

      const result = await cashRegisterService.save(cashRegisterData);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          number: "CR-001",
          active: true,
        })
      );
      expect(result).toEqual(savedCashRegister);
    });

    it("debería crear una entidad CashRegister con los datos correctos", async () => {
      const cashRegisterData: SaveCashRegisterDTO = {
        number: "CR-002",
        active: false,
      };

      let savedEntity: any;
      mockRepository.save.mockImplementation((cashRegister) => {
        savedEntity = cashRegister;
        return Promise.resolve({ cashRegisterId: 1, ...cashRegister } as CashRegister);
      });

      await cashRegisterService.save(cashRegisterData);

      expect(savedEntity).toBeInstanceOf(CashRegister);
      expect(savedEntity.number).toBe("CR-002");
      expect(savedEntity.active).toBe(false);
    });

    it("debería establecer active como true por defecto cuando no se especifica", async () => {
      const cashRegisterData: SaveCashRegisterDTO = {
        number: "CR-003",
        // active no especificado
      };

      let savedEntity: any;
      mockRepository.save.mockImplementation((cashRegister) => {
        savedEntity = cashRegister;
        return Promise.resolve(cashRegister as CashRegister);
      });

      await cashRegisterService.save(cashRegisterData);

      expect(savedEntity.active).toBe(true);
    });

    it("debería manejar active = undefined estableciendo true", async () => {
      const cashRegisterData: SaveCashRegisterDTO = {
        number: "CR-004",
        active: undefined,
      };

      let savedEntity: any;
      mockRepository.save.mockImplementation((cashRegister) => {
        savedEntity = cashRegister;
        return Promise.resolve(cashRegister as CashRegister);
      });

      await cashRegisterService.save(cashRegisterData);

      expect(savedEntity.active).toBe(true);
    });

    it("debería manejar diferentes números de caja", async () => {
      const numeros = ["CR-001", "CAJA-01", "REG-123", "01", "PRINCIPAL"];

      for (const numero of numeros) {
        const cashRegisterData: SaveCashRegisterDTO = {
          number: numero,
          active: true,
        };

        mockRepository.save.mockResolvedValue({} as CashRegister);

        await cashRegisterService.save(cashRegisterData);

        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            number: numero,
          })
        );
      }
    });

    it("debería manejar errores del repositorio", async () => {
      const cashRegisterData: SaveCashRegisterDTO = {
        number: "CR-ERROR",
        active: true,
      };

      const repositoryError = new Error("Error de base de datos");
      mockRepository.save.mockRejectedValue(repositoryError);

      await expect(cashRegisterService.save(cashRegisterData)).rejects.toThrow("Error de base de datos");
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe("saveAll", () => {
    it("debería guardar múltiples cajas registradoras exitosamente", async () => {
      const cashRegistersData = [
        { number: "CR-001", active: true },
        { number: "CR-002", active: false },
        { number: "CR-003", active: true },
      ];

      const savedCashRegisters = [
        { cashRegisterId: 1, number: "CR-001", active: true },
        { cashRegisterId: 2, number: "CR-002", active: false },
        { cashRegisterId: 3, number: "CR-003", active: true },
      ] as CashRegister[];

      mockRepository.save.mockResolvedValue(savedCashRegisters as any);

      const result = await cashRegisterService.saveAll(cashRegistersData);

      expect(mockRepository.save).toHaveBeenCalledWith(cashRegistersData);
      expect(result).toEqual(savedCashRegisters);
    });

    it("debería manejar array vacío", async () => {
      mockRepository.save.mockResolvedValue([] as any);

      const result = await cashRegisterService.saveAll([]);

      expect(mockRepository.save).toHaveBeenCalledWith([]);
      expect(result).toEqual([]);
    });

    it("debería manejar errores del repositorio", async () => {
      const cashRegistersData = [{ number: "CR-001", active: true }];
      const repositoryError = new Error("Error de guardado masivo");

      mockRepository.save.mockRejectedValue(repositoryError);

      await expect(cashRegisterService.saveAll(cashRegistersData)).rejects.toThrow("Error de guardado masivo");
    });
  });

  describe("delete", () => {
    it("debería eliminar una caja registradora exitosamente", async () => {
      const cashRegisterId = 1;
      const deleteResult = { affected: 1 };

      mockRepository.delete.mockResolvedValue(deleteResult as any);

      const result = await cashRegisterService.delete(cashRegisterId);

      expect(mockRepository.delete).toHaveBeenCalledWith(cashRegisterId);
      expect(result).toEqual({
        message: "Caja registradora eliminada correctamente",
        id: cashRegisterId,
      });
    });

    it("debería lanzar error cuando la caja registradora no existe", async () => {
      const cashRegisterId = 999;
      const deleteResult = { affected: 0 };

      mockRepository.delete.mockResolvedValue(deleteResult as any);

      await expect(cashRegisterService.delete(cashRegisterId)).rejects.toThrow(
        `Caja registradora con ID ${cashRegisterId} no encontrada`
      );
      expect(mockRepository.delete).toHaveBeenCalledWith(cashRegisterId);
    });

    it("debería manejar errores del repositorio", async () => {
      const cashRegisterId = 1;
      const repositoryError = new Error("Error de eliminación");

      mockRepository.delete.mockRejectedValue(repositoryError);

      await expect(cashRegisterService.delete(cashRegisterId)).rejects.toThrow("Error de eliminación");
      expect(mockRepository.delete).toHaveBeenCalledWith(cashRegisterId);
    });
  });

  describe("update", () => {
    it("debería actualizar una caja registradora exitosamente", async () => {
      const updateData = {
        cashRegisterId: 1,
        number: "CR-001-UPDATED",
        active: false,
      };

      const existingCashRegister = {
        cashRegisterId: 1,
        number: "CR-001",
        active: true,
      } as CashRegister;

      const updatedCashRegister = {
        cashRegisterId: 1,
        number: "CR-001-UPDATED",
        active: false,
      } as CashRegister;

      mockRepository.findOne.mockResolvedValue(existingCashRegister);
      mockRepository.save.mockResolvedValue(updatedCashRegister);

      const result = await cashRegisterService.update(updateData);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cashRegisterId: 1 },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          cashRegisterId: 1,
          number: "CR-001-UPDATED",
          active: false,
        })
      );
      expect(result).toEqual(updatedCashRegister);
    });

    it("debería actualizar solo los campos proporcionados", async () => {
      const updateData = {
        cashRegisterId: 1,
        active: false,
        // number no se actualiza
      };

      const existingCashRegister = {
        cashRegisterId: 1,
        number: "CR-ORIGINAL",
        active: true,
      } as CashRegister;

      mockRepository.findOne.mockResolvedValue(existingCashRegister);
      mockRepository.save.mockResolvedValue(existingCashRegister);

      await cashRegisterService.update(updateData);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          number: "CR-ORIGINAL", // No cambió
          active: false, // Cambió
        })
      );
    });

    it("debería lanzar error cuando cashRegisterId no se proporciona", async () => {
      const updateData = {
        number: "CR-SIN-ID",
        active: true,
      };

      await expect(cashRegisterService.update(updateData)).rejects.toThrow(
        "cashRegisterId es requerido para actualizar"
      );
      expect(mockRepository.findOne).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it("debería lanzar error cuando la caja registradora no existe", async () => {
      const updateData = {
        cashRegisterId: 999,
        number: "CR-NO-EXISTE",
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(cashRegisterService.update(updateData)).rejects.toThrow(
        "Caja registradora con ID 999 no encontrada"
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cashRegisterId: 999 },
      });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it("debería manejar errores del repositorio en findOne", async () => {
      const updateData = {
        cashRegisterId: 1,
        number: "CR-ERROR",
      };

      const repositoryError = new Error("Error de consulta");
      mockRepository.findOne.mockRejectedValue(repositoryError);

      await expect(cashRegisterService.update(updateData)).rejects.toThrow("Error de consulta");
    });

    it("debería manejar errores del repositorio en save", async () => {
      const updateData = {
        cashRegisterId: 1,
        number: "CR-ERROR-SAVE",
      };

      const existingCashRegister = {
        cashRegisterId: 1,
        number: "CR-ORIGINAL",
        active: true,
      } as CashRegister;

      const saveError = new Error("Error de guardado");

      mockRepository.findOne.mockResolvedValue(existingCashRegister);
      mockRepository.save.mockRejectedValue(saveError);

      await expect(cashRegisterService.update(updateData)).rejects.toThrow("Error de guardado");
    });
  });

  describe("getAll", () => {
    it("debería obtener todas las cajas registradoras ordenadas por número", async () => {
      const mockCashRegisters = [
        { cashRegisterId: 1, number: "CR-001", active: true },
        { cashRegisterId: 2, number: "CR-002", active: false },
        { cashRegisterId: 3, number: "CR-003", active: true },
      ] as CashRegister[];

      mockRepository.find.mockResolvedValue(mockCashRegisters);

      const result = await cashRegisterService.getAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { number: "ASC" },
      });
      expect(result).toEqual(mockCashRegisters);
      expect(result).toHaveLength(3);
    });

    it("debería retornar array vacío cuando no hay cajas registradoras", async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await cashRegisterService.getAll();

      expect(result).toEqual([]);
    });

    it("debería manejar errores del repositorio", async () => {
      const repositoryError = new Error("Error de consulta");
      mockRepository.find.mockRejectedValue(repositoryError);

      await expect(cashRegisterService.getAll()).rejects.toThrow("Error de consulta");
    });
  });

  describe("getById", () => {
    it("debería obtener una caja registradora por ID", async () => {
      const cashRegisterId = 1;
      const mockCashRegister = {
        cashRegisterId: 1,
        number: "CR-001",
        active: true,
      } as CashRegister;

      mockRepository.findOne.mockResolvedValue(mockCashRegister);

      const result = await cashRegisterService.getById(cashRegisterId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cashRegisterId: 1 },
      });
      expect(result).toEqual(mockCashRegister);
    });

    it("debería lanzar error cuando la caja registradora no existe", async () => {
      const cashRegisterId = 999;
      mockRepository.findOne.mockResolvedValue(null);

      await expect(cashRegisterService.getById(cashRegisterId)).rejects.toThrow(
        `Caja registradora con ID ${cashRegisterId} no encontrada`
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cashRegisterId: 999 },
      });
    });

    it("debería manejar errores del repositorio", async () => {
      const cashRegisterId = 1;
      const repositoryError = new Error("Error de consulta");
      mockRepository.findOne.mockRejectedValue(repositoryError);

      await expect(cashRegisterService.getById(cashRegisterId)).rejects.toThrow("Error de consulta");
    });
  });

  describe("getActiveCashRegisters", () => {
    it("debería obtener solo las cajas registradoras activas", async () => {
      const mockActiveCashRegisters = [
        { cashRegisterId: 1, number: "CR-001", active: true },
        { cashRegisterId: 3, number: "CR-003", active: true },
      ] as CashRegister[];

      mockRepository.find.mockResolvedValue(mockActiveCashRegisters);

      const result = await cashRegisterService.getActiveCashRegisters();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { active: true },
        order: { number: "ASC" },
      });
      expect(result).toEqual(mockActiveCashRegisters);
      expect(result.every(cr => cr.active)).toBe(true);
    });

    it("debería retornar array vacío cuando no hay cajas activas", async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await cashRegisterService.getActiveCashRegisters();

      expect(result).toEqual([]);
    });

    it("debería manejar errores del repositorio", async () => {
      const repositoryError = new Error("Error de consulta");
      mockRepository.find.mockRejectedValue(repositoryError);

      await expect(cashRegisterService.getActiveCashRegisters()).rejects.toThrow("Error de consulta");
    });
  });

  describe("getByNumber", () => {
    it("debería obtener cajas registradoras por número", async () => {
      const number = "CR-001";
      const mockCashRegisters = [
        { cashRegisterId: 1, number: "CR-001", active: true },
      ] as CashRegister[];

      mockRepository.find.mockResolvedValue(mockCashRegisters);

      const result = await cashRegisterService.getByNumber(number);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { number: "CR-001" },
        order: { number: "ASC" },
      });
      expect(result).toEqual(mockCashRegisters);
    });

    it("debería retornar array vacío cuando no encuentra el número", async () => {
      const number = "CR-NO-EXISTE";
      mockRepository.find.mockResolvedValue([]);

      const result = await cashRegisterService.getByNumber(number);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { number: "CR-NO-EXISTE" },
        order: { number: "ASC" },
      });
      expect(result).toEqual([]);
    });

    it("debería manejar diferentes formatos de número", async () => {
      const numeros = ["CR-001", "CAJA-01", "01", "PRINCIPAL", "REG-123"];

      for (const numero of numeros) {
        mockRepository.find.mockResolvedValue([]);

        await cashRegisterService.getByNumber(numero);

        expect(mockRepository.find).toHaveBeenCalledWith({
          where: { number: numero },
          order: { number: "ASC" },
        });
      }
    });

    it("debería manejar errores del repositorio", async () => {
      const number = "CR-ERROR";
      const repositoryError = new Error("Error de consulta");
      mockRepository.find.mockRejectedValue(repositoryError);

      await expect(cashRegisterService.getByNumber(number)).rejects.toThrow("Error de consulta");
    });
  });

  describe("Casos de integración", () => {
    it("debería manejar flujo completo de CRUD", async () => {
      const cashRegisterData: SaveCashRegisterDTO = {
        number: "CR-INTEGRACIÓN",
        active: true,
      };

      const savedCashRegister = {
        cashRegisterId: 1,
        number: "CR-INTEGRACIÓN",
        active: true,
      } as CashRegister;

      const updateData = {
        cashRegisterId: 1,
        active: false,
      };

      const updatedCashRegister = {
        ...savedCashRegister,
        active: false,
      } as CashRegister;

      // 1. Guardar
      mockRepository.save.mockResolvedValueOnce(savedCashRegister);
      const saveResult = await cashRegisterService.save(cashRegisterData);
      expect(saveResult).toEqual(savedCashRegister);

      // 2. Obtener por ID
      mockRepository.findOne.mockResolvedValueOnce(savedCashRegister);
      const getResult = await cashRegisterService.getById(1);
      expect(getResult).toEqual(savedCashRegister);

      // 3. Actualizar
      mockRepository.findOne.mockResolvedValueOnce(savedCashRegister);
      mockRepository.save.mockResolvedValueOnce(updatedCashRegister);
      const updateResult = await cashRegisterService.update(updateData);
      expect(updateResult).toEqual(updatedCashRegister);

      // 4. Obtener todas
      mockRepository.find.mockResolvedValueOnce([updatedCashRegister]);
      const getAllResult = await cashRegisterService.getAll();
      expect(getAllResult).toContain(updatedCashRegister);

      // 5. Eliminar
      mockRepository.delete.mockResolvedValueOnce({ affected: 1 } as any);
      const deleteResult = await cashRegisterService.delete(1);
      expect(deleteResult.message).toBe("Caja registradora eliminada correctamente");
    });

    it("debería manejar gestión de cajas activas e inactivas", async () => {
      const cajasData = [
        { number: "CR-001", active: true },
        { number: "CR-002", active: false },
        { number: "CR-003", active: true },
        { number: "CR-004", active: false },
      ];

      const todasLasCajas = cajasData.map((data, index) => ({
        cashRegisterId: index + 1,
        ...data,
      })) as CashRegister[];

      const cajasActivas = todasLasCajas.filter(caja => caja.active);

      // Obtener todas las cajas
      mockRepository.find.mockResolvedValueOnce(todasLasCajas);
      const allResult = await cashRegisterService.getAll();
      expect(allResult).toHaveLength(4);

      // Obtener solo las activas
      mockRepository.find.mockResolvedValueOnce(cajasActivas);
      const activeResult = await cashRegisterService.getActiveCashRegisters();
      expect(activeResult).toHaveLength(2);
      expect(activeResult.every(cr => cr.active)).toBe(true);
    });

    it("debería manejar búsqueda por número específico", async () => {
      const numerosBusqueda = ["CR-001", "CR-002", "CR-ESPECIAL"];

      for (const numero of numerosBusqueda) {
        const cajaEncontrada = [
          { cashRegisterId: 1, number: numero, active: true },
        ] as CashRegister[];

        mockRepository.find.mockResolvedValueOnce(cajaEncontrada);

        const result = await cashRegisterService.getByNumber(numero);

        expect(result).toHaveLength(1);
        expect(result[0].number).toBe(numero);
      }
    });
  });

  describe("Validaciones de datos", () => {
    it("debería manejar números con diferentes formatos", async () => {
      const formatosNumero = [
        "CR-001",
        "CAJA-PRINCIPAL",
        "01",
        "REG-123-A",
        "PRINCIPAL",
        "CAJA_01",
        "CR.001",
      ];

      for (const numero of formatosNumero) {
        const cashRegisterData: SaveCashRegisterDTO = {
          number: numero,
          active: true,
        };

        mockRepository.save.mockResolvedValue({} as CashRegister);

        await cashRegisterService.save(cashRegisterData);

        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            number: numero,
          })
        );
      }
    });

    it("debería manejar valores booleanos de active", async () => {
      const valoresActive = [true, false];

      for (const active of valoresActive) {
        const cashRegisterData: SaveCashRegisterDTO = {
          number: `CR-${active}`,
          active: active,
        };

        mockRepository.save.mockResolvedValue({} as CashRegister);

        await cashRegisterService.save(cashRegisterData);

        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            active: active,
          })
        );
      }
    });

    it("debería manejar actualizaciones parciales", async () => {
      const existingCashRegister = {
        cashRegisterId: 1,
        number: "CR-ORIGINAL",
        active: true,
      } as CashRegister;

      const actualizacionesParciales = [
        { cashRegisterId: 1, number: "CR-NUEVO-NUMERO" },
        { cashRegisterId: 1, active: false },
        { cashRegisterId: 1, number: "CR-ACTUALIZADO", active: false },
      ];

      for (const update of actualizacionesParciales) {
        mockRepository.findOne.mockResolvedValue(existingCashRegister);
        mockRepository.save.mockResolvedValue({} as CashRegister);

        await cashRegisterService.update(update);

        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining(update)
        );
      }
    });

    it("debería manejar IDs diversos", async () => {
      const ids = [1, 10, 100, 999, 1000];

      for (const id of ids) {
        const mockCashRegister = {
          cashRegisterId: id,
          number: `CR-${id}`,
          active: true,
        } as CashRegister;

        mockRepository.findOne.mockResolvedValue(mockCashRegister);

        const result = await cashRegisterService.getById(id);

        expect(result.cashRegisterId).toBe(id);
        expect(mockRepository.findOne).toHaveBeenCalledWith({
          where: { cashRegisterId: id },
        });
      }
    });
  });
});