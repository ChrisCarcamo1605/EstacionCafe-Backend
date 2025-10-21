import { Repository } from "typeorm";
import { ConsumableService } from "../ConsumableService";
import { Consumable } from "../../../core/entities/Consumable";
import { SaveConsumableDTO } from "../../DTOs/ConsumableDTO";
import { UnitMeasurement } from "../../../core/enums/UnitMeasurement";

describe("ConsumableService", () => {
  let consumableService: ConsumableService;
  let mockRepository: jest.Mocked<Repository<Consumable>>;

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
    consumableService = new ConsumableService(mockRepository);

    // Limpiar console.log
    jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("save", () => {
    it("debería guardar un consumible exitosamente", async () => {
      const consumableData: SaveConsumableDTO = {
        supplier: 1,
        name: "Leche Entera",
        TypeId: 2,
        cost: 25.50,
        quantity: 100,
        unitMeasurement: UnitMeasurement.LITER,
      };

      const savedConsumable = {
        consumableId: 1,
        supplierId: 1,
        name: "Leche Entera",
        cosumableTypeId: 2,
        cost: 25.50,
        quantity: 100,
        unitMeasurement: UnitMeasurement.LITER,
      } as Consumable;

      mockRepository.save.mockResolvedValue(savedConsumable);

      const result = await consumableService.save(consumableData);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          supplierId: 1,
          name: "Leche Entera",
          cosumableTypeId: 2,
          cost: 25.50,
          quantity: 100,
          unitMeasurement: UnitMeasurement.LITER,
        })
      );
      expect(result).toEqual(savedConsumable);
    });

    it("debería crear una entidad Consumable con los datos correctos", async () => {
      const consumableData: SaveConsumableDTO = {
        supplier: 3,
        name: "Azúcar Morena",
        TypeId: 1,
        cost: 15.75,
        quantity: 50,
        unitMeasurement: UnitMeasurement.KILOGRAM,
      };

      let savedEntity: any;
      mockRepository.save.mockImplementation((consumable) => {
        savedEntity = consumable;
        return Promise.resolve({ consumableId: 1, ...consumable } as Consumable);
      });

      await consumableService.save(consumableData);

      expect(savedEntity).toBeInstanceOf(Consumable);
      expect(savedEntity.supplierId).toBe(3);
      expect(savedEntity.name).toBe("Azúcar Morena");
      expect(savedEntity.cosumableTypeId).toBe(1);
      expect(savedEntity.cost).toBe(15.75);
      expect(savedEntity.quantity).toBe(50);
      expect(savedEntity.unitMeasurement).toBe(UnitMeasurement.KILOGRAM);
    });

    it("debería manejar diferentes unidades de medida", async () => {
      const unidades = [
        UnitMeasurement.GRAM,
        UnitMeasurement.KILOGRAM,
        UnitMeasurement.LITER,
        UnitMeasurement.MILLILITER,
        UnitMeasurement.UNIT,
        UnitMeasurement.POUND,
        UnitMeasurement.OUNCE,
        UnitMeasurement.CUP,
        UnitMeasurement.PIECE,
      ];

      for (const unidad of unidades) {
        const consumableData: SaveConsumableDTO = {
          supplier: 1,
          name: `Producto ${unidad}`,
          TypeId: 1,
          cost: 10.00,
          quantity: 20,
          unitMeasurement: unidad,
        };

        mockRepository.save.mockResolvedValue({} as Consumable);

        await consumableService.save(consumableData);

        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            unitMeasurement: unidad,
          })
        );
      }
    });

    it("debería manejar errores del repositorio", async () => {
      const consumableData: SaveConsumableDTO = {
        supplier: 1,
        name: "Test",
        TypeId: 1,
        cost: 10.00,
        quantity: 5,
        unitMeasurement: UnitMeasurement.UNIT,
      };

      const repositoryError = new Error("Error de base de datos");
      mockRepository.save.mockRejectedValue(repositoryError);

      await expect(consumableService.save(consumableData)).rejects.toThrow("Error de base de datos");
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe("saveAll", () => {
    it("debería guardar múltiples consumibles exitosamente", async () => {
      const consumablesData: SaveConsumableDTO[] = [
        {
          supplier: 1,
          name: "Café Arábica",
          TypeId: 1,
          cost: 45.00,
          quantity: 25,
          unitMeasurement: UnitMeasurement.KILOGRAM,
        },
        {
          supplier: 2,
          name: "Leche Descremada",
          TypeId: 2,
          cost: 20.00,
          quantity: 50,
          unitMeasurement: UnitMeasurement.LITER,
        },
      ];

      const savedConsumables = [
        { consumableId: 1, supplierId: 1, name: "Café Arábica", cosumableTypeId: 1, cost: 45.00, quantity: 25, unitMeasurement: UnitMeasurement.KILOGRAM },
        { consumableId: 2, supplierId: 2, name: "Leche Descremada", cosumableTypeId: 2, cost: 20.00, quantity: 50, unitMeasurement: UnitMeasurement.LITER },
      ] as Consumable[];

      mockRepository.save.mockResolvedValue(savedConsumables as any);

      const result = await consumableService.saveAll(consumablesData);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            supplierId: 1,
            name: "Café Arábica",
            cosumableTypeId: 1,
            unitMeasurement: UnitMeasurement.KILOGRAM,
          }),
          expect.objectContaining({
            supplierId: 2,
            name: "Leche Descremada", 
            cosumableTypeId: 2,
            unitMeasurement: UnitMeasurement.LITER,
          }),
        ])
      );
      expect(result).toEqual(savedConsumables);
    });

    it("debería crear entidades Consumable para cada elemento", async () => {
      const consumablesData: SaveConsumableDTO[] = [
        {
          supplier: 1,
          name: "Test Item",
          TypeId: 1,
          cost: 10.00,
          quantity: 5,
          unitMeasurement: UnitMeasurement.UNIT,
        },
      ];

      let savedEntities: any[];
      mockRepository.save.mockImplementation((consumables: any) => {
        savedEntities = consumables as any[];
        return Promise.resolve(consumables as any);
      });

      await consumableService.saveAll(consumablesData);

      expect(savedEntities![0]).toBeInstanceOf(Consumable);
      expect(savedEntities![0].name).toBe("Test Item");
    });

    it("debería manejar array vacío", async () => {
      mockRepository.save.mockResolvedValue([] as any);

      const result = await consumableService.saveAll([]);

      expect(mockRepository.save).toHaveBeenCalledWith([]);
      expect(result).toEqual([]);
    });
  });

  describe("delete", () => {
    it("debería eliminar un consumible exitosamente", async () => {
      const consumableId = 1;
      const deleteResult = { affected: 1 };

      mockRepository.delete.mockResolvedValue(deleteResult as any);

      await consumableService.delete(consumableId);

      expect(mockRepository.delete).toHaveBeenCalledWith(consumableId);
    });

    it("debería lanzar error cuando el consumible no existe", async () => {
      const consumableId = 999;
      const deleteResult = { affected: 0 };

      mockRepository.delete.mockResolvedValue(deleteResult as any);

      await expect(consumableService.delete(consumableId)).rejects.toThrow(
        `Consumible con ID ${consumableId} no encontrado`
      );
      expect(mockRepository.delete).toHaveBeenCalledWith(consumableId);
    });

    it("debería manejar errores del repositorio", async () => {
      const consumableId = 1;
      const repositoryError = new Error("Error de eliminación");

      mockRepository.delete.mockRejectedValue(repositoryError);

      await expect(consumableService.delete(consumableId)).rejects.toThrow("Error de eliminación");
      expect(mockRepository.delete).toHaveBeenCalledWith(consumableId);
    });
  });

  describe("update", () => {
    it("debería actualizar un consumible exitosamente", async () => {
      const updateData = {
        TypeId: 1,
        name: "Nombre Actualizado",
        cost: 30.00,
      };

      const existingConsumable = {
        consumableId: 1,
        supplierId: 2,
        name: "Nombre Anterior",
        cosumableTypeId: 1,
        cost: 25.00,
        quantity: 100,
        unitMeasurement: UnitMeasurement.KILOGRAM,
      } as Consumable;

      const updatedConsumable = {
        ...existingConsumable,
        name: "Nombre Actualizado",
        cost: 30.00,
      } as Consumable;

      mockRepository.findOne.mockResolvedValue(existingConsumable);
      mockRepository.save.mockResolvedValue(updatedConsumable);

      const result = await consumableService.update(updateData);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { consumableId: 1 },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Nombre Actualizado",
          cost: 30.00,
          supplierId: 2, // No cambió
          quantity: 100, // No cambió
        })
      );
      expect(result).toEqual(updatedConsumable);
    });

    it("debería actualizar solo los campos proporcionados", async () => {
      const updateData = {
        TypeId: 1,
        quantity: 150,
      };

      const existingConsumable = {
        consumableId: 1,
        supplierId: 2,
        name: "Producto Original",
        cosumableTypeId: 1,
        cost: 25.00,
        quantity: 100,
        unitMeasurement: UnitMeasurement.KILOGRAM,
      } as Consumable;

      mockRepository.findOne.mockResolvedValue(existingConsumable);
      mockRepository.save.mockResolvedValue(existingConsumable);

      await consumableService.update(updateData);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Producto Original", // No cambió
          cost: 25.00, // No cambió
          quantity: 150, // Cambió
          unitMeasurement: UnitMeasurement.KILOGRAM, // No cambió
        })
      );
    });

    it("debería lanzar error cuando el consumible no existe", async () => {
      const updateData = {
        TypeId: 999,
        name: "No existe",
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(consumableService.update(updateData)).rejects.toThrow(
        "Consumible con ID 999 no encontrado"
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { consumableId: 999 },
      });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it("debería manejar actualización de unidad de medida", async () => {
      const updateData = {
        TypeId: 1,
        unitMeasurement: UnitMeasurement.LITER,
      };

      const existingConsumable = {
        consumableId: 1,
        unitMeasurement: UnitMeasurement.KILOGRAM,
      } as Consumable;

      mockRepository.findOne.mockResolvedValue(existingConsumable);
      mockRepository.save.mockResolvedValue(existingConsumable);

      await consumableService.update(updateData);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          unitMeasurement: UnitMeasurement.LITER,
        })
      );
    });
  });

  describe("getAll", () => {
    it("debería obtener todos los consumibles con relaciones", async () => {
      const mockConsumables = [
        {
          consumableId: 1,
          supplierId: 1,
          name: "Café Premium",
          cosumableTypeId: 1,
          cost: 50.00,
          quantity: 20,
          unitMeasurement: UnitMeasurement.KILOGRAM,
          consumableType: { consumableTypeId: 1, name: "Granos", consumable: {} as Consumable },
          ingredients: [],
        },
        {
          consumableId: 2,
          supplierId: 2,
          name: "Leche Orgánica",
          cosumableTypeId: 2,
          cost: 30.00,
          quantity: 40,
          unitMeasurement: UnitMeasurement.LITER,
          consumableType: { consumableTypeId: 2, name: "Lácteos", consumable: {} as Consumable },
          ingredients: [],
        },
      ] as Consumable[];

      mockRepository.find.mockResolvedValue(mockConsumables);

      const result = await consumableService.getAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ["consumableType"],
      });
      expect(result).toEqual(mockConsumables);
    });

    it("debería retornar array vacío cuando no hay consumibles", async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await consumableService.getAll();

      expect(result).toEqual([]);
    });

    it("debería manejar errores del repositorio", async () => {
      const repositoryError = new Error("Error de conexión");
      mockRepository.find.mockRejectedValue(repositoryError);

      await expect(consumableService.getAll()).rejects.toThrow("Error de conexión");
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("debería obtener un consumible por ID con relaciones", async () => {
      const consumableId = 1;
      const mockConsumable = {
        consumableId: 1,
        supplierId: 1,
        name: "Café Especial",
        cosumableTypeId: 1,
        cost: 60.00,
        quantity: 15,
        unitMeasurement: UnitMeasurement.KILOGRAM,
        consumableType: { consumableTypeId: 1, name: "Granos Premium", consumable: {} as Consumable },
        ingredients: [],
      } as Consumable;

      mockRepository.findOne.mockResolvedValue(mockConsumable);

      const result = await consumableService.getById(consumableId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { consumableId: 1 },
        relations: ["consumableType"],
      });
      expect(result).toEqual(mockConsumable);
    });

    it("debería retornar null cuando el consumible no existe", async () => {
      const consumableId = 999;
      mockRepository.findOne.mockResolvedValue(null);

      const result = await consumableService.getById(consumableId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { consumableId: 999 },
        relations: ["consumableType"],
      });
      expect(result).toBeNull();
    });

    it("debería manejar errores del repositorio", async () => {
      const consumableId = 1;
      const repositoryError = new Error("Error de consulta");
      mockRepository.findOne.mockRejectedValue(repositoryError);

      await expect(consumableService.getById(consumableId)).rejects.toThrow("Error de consulta");
      expect(mockRepository.findOne).toHaveBeenCalled();
    });
  });

  describe("Casos de integración", () => {
    it("debería manejar flujo completo de CRUD", async () => {
      const consumableData: SaveConsumableDTO = {
        supplier: 1,
        name: "Nuevo Consumible",
        TypeId: 1,
        cost: 25.00,
        quantity: 50,
        unitMeasurement: UnitMeasurement.UNIT,
      };

      const savedConsumable = {
        consumableId: 1,
        supplierId: 1,
        name: "Nuevo Consumible",
        cosumableTypeId: 1,
        cost: 25.00,
        quantity: 50,
        unitMeasurement: UnitMeasurement.UNIT,
      } as Consumable;

      const updateData = {
        TypeId: 1,
        cost: 35.00,
      };

      const updatedConsumable = {
        ...savedConsumable,
        cost: 35.00,
      } as Consumable;

      // 1. Guardar
      mockRepository.save.mockResolvedValueOnce(savedConsumable);
      const saveResult = await consumableService.save(consumableData);
      expect(saveResult).toEqual(savedConsumable);

      // 2. Obtener por ID
      mockRepository.findOne.mockResolvedValueOnce(savedConsumable);
      const getResult = await consumableService.getById(1);
      expect(getResult).toEqual(savedConsumable);

      // 3. Actualizar
      mockRepository.findOne.mockResolvedValueOnce(savedConsumable);
      mockRepository.save.mockResolvedValueOnce(updatedConsumable);
      const updateResult = await consumableService.update(updateData);
      expect(updateResult).toEqual(updatedConsumable);

      // 4. Eliminar
      mockRepository.delete.mockResolvedValueOnce({ affected: 1 } as any);
      await expect(consumableService.delete(1)).resolves.not.toThrow();
    });

    it("debería manejar diferentes escenarios de unidades de medida", async () => {
      const escenarios = [
        { unidad: UnitMeasurement.GRAM, cantidad: 500, nombre: "Canela en Polvo" },
        { unidad: UnitMeasurement.LITER, cantidad: 10, nombre: "Leche Entera" },
        { unidad: UnitMeasurement.UNIT, cantidad: 100, nombre: "Vasos Desechables" },
        { unidad: UnitMeasurement.KILOGRAM, cantidad: 5, nombre: "Azúcar Blanca" },
      ];

      for (const escenario of escenarios) {
        const consumableData: SaveConsumableDTO = {
          supplier: 1,
          name: escenario.nombre,
          TypeId: 1,
          cost: 20.00,
          quantity: escenario.cantidad,
          unitMeasurement: escenario.unidad,
        };

        mockRepository.save.mockResolvedValue({} as Consumable);

        await consumableService.save(consumableData);

        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            name: escenario.nombre,
            quantity: escenario.cantidad,
            unitMeasurement: escenario.unidad,
          })
        );
      }
    });
  });

  describe("Validaciones de datos", () => {
    it("debería manejar costos con decimales precisos", async () => {
      const consumableData: SaveConsumableDTO = {
        supplier: 1,
        name: "Producto Caro",
        TypeId: 1,
        cost: 99.99,
        quantity: 1,
        unitMeasurement: UnitMeasurement.UNIT,
      };

      mockRepository.save.mockResolvedValue({} as Consumable);

      await consumableService.save(consumableData);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          cost: 99.99,
        })
      );
    });

    it("debería manejar cantidades grandes", async () => {
      const consumableData: SaveConsumableDTO = {
        supplier: 1,
        name: "Producto a Granel",
        TypeId: 1,
        cost: 5.00,
        quantity: 10000,
        unitMeasurement: UnitMeasurement.GRAM,
      };

      mockRepository.save.mockResolvedValue({} as Consumable);

      await consumableService.save(consumableData);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          quantity: 10000,
        })
      );
    });

    it("debería manejar nombres con caracteres especiales", async () => {
      const consumableData: SaveConsumableDTO = {
        supplier: 1,
        name: "Café 100% Arábica - Edición Especial",
        TypeId: 1,
        cost: 75.50,
        quantity: 2.5,
        unitMeasurement: UnitMeasurement.KILOGRAM,
      };

      mockRepository.save.mockResolvedValue({} as Consumable);

      await consumableService.save(consumableData);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Café 100% Arábica - Edición Especial",
        })
      );
    });

    it("debería manejar IDs de proveedor y tipo diversos", async () => {
      const casos = [
        { supplier: 1, TypeId: 1 },
        { supplier: 999, TypeId: 888 },
        { supplier: 5, TypeId: 3 },
      ];

      for (const caso of casos) {
        const consumableData: SaveConsumableDTO = {
          supplier: caso.supplier,
          name: "Test Product",
          TypeId: caso.TypeId,
          cost: 10.00,
          quantity: 5,
          unitMeasurement: UnitMeasurement.UNIT,
        };

        mockRepository.save.mockResolvedValue({} as Consumable);

        await consumableService.save(consumableData);

        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            supplierId: caso.supplier,
            cosumableTypeId: caso.TypeId,
          })
        );
      }
    });
  });
});