import { CashRegisterService } from "../CashRegisterService";
import { Repository } from "typeorm";
import { CashRegister } from "../../../core/entities/CashRegister";
import { SaveCashRegisterDTO } from "../../DTOs/CashRegisterDTO";

describe("CashRegisterService", () => {
  let cashRegisterService: CashRegisterService;
  let mockRepository: jest.Mocked<Repository<CashRegister>>;

  beforeEach(() => {
    // Create mock repository with all necessary methods
    mockRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<CashRegister>>;

    cashRegisterService = new CashRegisterService(mockRepository);

    // Mock console methods to avoid noise in tests
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("save", () => {
    it("should save a cash register successfully with default active true", async () => {
      const saveCashRegisterDTO: SaveCashRegisterDTO = {
        number: "CAJA001",
      };

      const expectedCashRegister = new CashRegister();
      expectedCashRegister.cashRegisterId = 1;
      expectedCashRegister.number = saveCashRegisterDTO.number;
      expectedCashRegister.active = true;

      mockRepository.save.mockResolvedValue(expectedCashRegister);

      const result = await cashRegisterService.save(saveCashRegisterDTO);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        number: saveCashRegisterDTO.number,
        active: true,
      }));
      expect(result).toEqual(expectedCashRegister);
    });

    it("should save a cash register with explicit active value", async () => {
      const saveCashRegisterDTO: SaveCashRegisterDTO = {
        number: "CAJA002",
        active: false,
      };

      const expectedCashRegister = new CashRegister();
      expectedCashRegister.cashRegisterId = 1;
      expectedCashRegister.number = saveCashRegisterDTO.number;
      expectedCashRegister.active = false;

      mockRepository.save.mockResolvedValue(expectedCashRegister);

      const result = await cashRegisterService.save(saveCashRegisterDTO);

      expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        number: saveCashRegisterDTO.number,
        active: false,
      }));
      expect(result).toEqual(expectedCashRegister);
    });

    it("should handle database errors during save", async () => {
      const saveCashRegisterDTO: SaveCashRegisterDTO = {
        number: "CAJA001",
      };

      const databaseError = new Error("Database connection failed");
      mockRepository.save.mockRejectedValue(databaseError);

      await expect(cashRegisterService.save(saveCashRegisterDTO)).rejects.toThrow("Database connection failed");
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe("saveAll", () => {
    it("should save multiple cash registers successfully", async () => {
      const cashRegisters = [
        { number: "CAJA001", active: true },
        { number: "CAJA002", active: false },
      ];

      const expectedCashRegisters = cashRegisters.map((cr, index) => ({
        cashRegisterId: index + 1,
        ...cr,
      }));

      mockRepository.save.mockResolvedValue(expectedCashRegisters as any);

      const result = await cashRegisterService.saveAll(cashRegisters);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(cashRegisters);
      expect(result).toEqual(expectedCashRegisters);
    });

    it("should handle empty array input", async () => {
      const cashRegisters: any[] = [];
      mockRepository.save.mockResolvedValue([] as any);

      const result = await cashRegisterService.saveAll(cashRegisters);

      expect(mockRepository.save).toHaveBeenCalledWith([]);
      expect(result).toEqual([]);
    });

    it("should handle database errors during saveAll", async () => {
      const cashRegisters = [{ number: "CAJA001", active: true }];
      const databaseError = new Error("Database connection failed");
      
      mockRepository.save.mockRejectedValue(databaseError);

      await expect(cashRegisterService.saveAll(cashRegisters)).rejects.toThrow("Database connection failed");
    });
  });

  describe("getById", () => {
    it("should get a cash register by id successfully", async () => {
      const cashRegisterId = 1;
      const expectedCashRegister = new CashRegister();
      expectedCashRegister.cashRegisterId = cashRegisterId;
      expectedCashRegister.number = "CAJA001";
      expectedCashRegister.active = true;

      mockRepository.findOne.mockResolvedValue(expectedCashRegister);

      const result = await cashRegisterService.getById(cashRegisterId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cashRegisterId },
      });
      expect(result).toEqual(expectedCashRegister);
    });

    it("should throw error when cash register not found", async () => {
      const cashRegisterId = 999;
      mockRepository.findOne.mockResolvedValue(null);

      await expect(cashRegisterService.getById(cashRegisterId)).rejects.toThrow(`Caja registradora con ID ${cashRegisterId} no encontrada`);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cashRegisterId },
      });
    });

    it("should handle database errors during getById", async () => {
      const cashRegisterId = 1;
      const databaseError = new Error("Database connection failed");
      mockRepository.findOne.mockRejectedValue(databaseError);

      await expect(cashRegisterService.getById(cashRegisterId)).rejects.toThrow("Database connection failed");
    });
  });

  describe("getAll", () => {
    it("should get all cash registers successfully", async () => {
      const expectedCashRegisters = [
        { cashRegisterId: 1, number: "CAJA001", active: true },
        { cashRegisterId: 2, number: "CAJA002", active: false },
      ] as CashRegister[];

      mockRepository.find.mockResolvedValue(expectedCashRegisters);

      const result = await cashRegisterService.getAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { number: "ASC" },
      });
      expect(result).toEqual(expectedCashRegisters);
    });

    it("should return empty array when no cash registers found", async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await cashRegisterService.getAll();

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it("should handle database errors during getAll", async () => {
      const databaseError = new Error("Database connection failed");
      mockRepository.find.mockRejectedValue(databaseError);

      await expect(cashRegisterService.getAll()).rejects.toThrow("Database connection failed");
    });
  });

  describe("update", () => {
    it("should update a cash register successfully", async () => {
      const updateData = {
        cashRegisterId: 1,
        number: "CAJA001-UPDATED",
        active: false,
      };

      const existingCashRegister = new CashRegister();
      existingCashRegister.cashRegisterId = 1;
      existingCashRegister.number = "CAJA001";
      existingCashRegister.active = true;

      const updatedCashRegister = { ...existingCashRegister, ...updateData };

      mockRepository.findOne.mockResolvedValue(existingCashRegister);
      mockRepository.save.mockResolvedValue(updatedCashRegister);

      const result = await cashRegisterService.update(updateData);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cashRegisterId: updateData.cashRegisterId },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        cashRegisterId: updateData.cashRegisterId,
        number: updateData.number,
        active: updateData.active,
      }));
      expect(result).toEqual(updatedCashRegister);
    });

    it("should throw error when cashRegisterId is not provided", async () => {
      const updateData = {
        number: "CAJA001-UPDATED",
        active: false,
      };

      await expect(cashRegisterService.update(updateData)).rejects.toThrow("cashRegisterId es requerido para actualizar");
      expect(mockRepository.findOne).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it("should throw error when cash register not found for update", async () => {
      const updateData = {
        cashRegisterId: 999,
        number: "CAJA999",
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(cashRegisterService.update(updateData)).rejects.toThrow(`Caja registradora con ID ${updateData.cashRegisterId} no encontrada`);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cashRegisterId: updateData.cashRegisterId },
      });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it("should handle database errors during update", async () => {
      const updateData = {
        cashRegisterId: 1,
        number: "CAJA001-UPDATED",
      };

      const databaseError = new Error("Database connection failed");
      mockRepository.findOne.mockRejectedValue(databaseError);

      await expect(cashRegisterService.update(updateData)).rejects.toThrow("Database connection failed");
    });
  });

  describe("delete", () => {
    it("should deactivate a cash register successfully (soft delete)", async () => {
      const cashRegisterId = 1;
      const existingCashRegister = new CashRegister();
      existingCashRegister.cashRegisterId = cashRegisterId;
      existingCashRegister.number = "CAJA001";
      existingCashRegister.active = true;

      const deactivatedCashRegister = { ...existingCashRegister, active: false };

      // Mock getById call within delete method
      mockRepository.findOne.mockResolvedValue(existingCashRegister);
      mockRepository.save.mockResolvedValue(deactivatedCashRegister);

      const result = await cashRegisterService.delete(cashRegisterId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cashRegisterId },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        active: false,
      }));
      expect(result).toEqual({
        message: "Caja registradora desactivada correctamente",
        id: cashRegisterId,
      });
    });

    it("should throw error when cash register not found for deletion", async () => {
      const cashRegisterId = 999;
      mockRepository.findOne.mockResolvedValue(null);

      await expect(cashRegisterService.delete(cashRegisterId)).rejects.toThrow(`Caja registradora con ID ${cashRegisterId} no encontrada`);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cashRegisterId },
      });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it("should handle database errors during delete", async () => {
      const cashRegisterId = 1;
      const databaseError = new Error("Database connection failed");
      mockRepository.findOne.mockRejectedValue(databaseError);

      await expect(cashRegisterService.delete(cashRegisterId)).rejects.toThrow("Database connection failed");
    });
  });

  describe("getActiveCashRegisters", () => {
    it("should get only active cash registers successfully", async () => {
      const expectedActiveCashRegisters = [
        { cashRegisterId: 1, number: "CAJA001", active: true },
        { cashRegisterId: 3, number: "CAJA003", active: true },
      ] as CashRegister[];

      mockRepository.find.mockResolvedValue(expectedActiveCashRegisters);

      const result = await cashRegisterService.getActiveCashRegisters();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { active: true },
        order: { number: "ASC" },
      });
      expect(result).toEqual(expectedActiveCashRegisters);
    });

    it("should return empty array when no active cash registers found", async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await cashRegisterService.getActiveCashRegisters();

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { active: true },
        order: { number: "ASC" },
      });
    });

    it("should handle database errors during getActiveCashRegisters", async () => {
      const databaseError = new Error("Database connection failed");
      mockRepository.find.mockRejectedValue(databaseError);

      await expect(cashRegisterService.getActiveCashRegisters()).rejects.toThrow("Database connection failed");
    });
  });

  describe("getByNumber", () => {
    it("should get cash registers by number successfully", async () => {
      const searchNumber = "CAJA001";
      const expectedCashRegisters = [
        { cashRegisterId: 1, number: searchNumber, active: true },
      ] as CashRegister[];

      mockRepository.find.mockResolvedValue(expectedCashRegisters);

      const result = await cashRegisterService.getByNumber(searchNumber);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { number: searchNumber },
        order: { number: "ASC" },
      });
      expect(result).toEqual(expectedCashRegisters);
    });

    it("should return empty array when no cash registers match the number", async () => {
      const searchNumber = "NONEXISTENT";
      mockRepository.find.mockResolvedValue([]);

      const result = await cashRegisterService.getByNumber(searchNumber);

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { number: searchNumber },
        order: { number: "ASC" },
      });
    });

    it("should handle database errors during getByNumber", async () => {
      const searchNumber = "CAJA001";
      const databaseError = new Error("Database connection failed");
      mockRepository.find.mockRejectedValue(databaseError);

      await expect(cashRegisterService.getByNumber(searchNumber)).rejects.toThrow("Database connection failed");
    });

    it("should handle multiple cash registers with same number", async () => {
      const searchNumber = "CAJA001";
      const expectedCashRegisters = [
        { cashRegisterId: 1, number: searchNumber, active: true },
        { cashRegisterId: 4, number: searchNumber, active: false },
      ] as CashRegister[];

      mockRepository.find.mockResolvedValue(expectedCashRegisters);

      const result = await cashRegisterService.getByNumber(searchNumber);

      expect(result).toEqual(expectedCashRegisters);
      expect(result).toHaveLength(2);
    });
  });
});