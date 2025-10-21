import { Repository } from "typeorm";
import { BillService } from "../BillService";
import { Bill } from "../../../core/entities/Bill";
import { SaveBillDTO } from "../../DTOs/BillsDTO";

describe("BillService", () => {
  let billService: BillService;
  let mockRepository: jest.Mocked<Repository<Bill>>;

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
    billService = new BillService(mockRepository);

    // Limpiar console.log
    jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("save", () => {
    it("debería guardar una factura exitosamente", async () => {
      const billData: SaveBillDTO = {
        billId: 0,
        customer: "Juan Pérez",
        cashRegister: 1,
        total: 125.5,
        date: new Date("2025-10-20T10:30:00"),
      };

      const savedBill = {
        billId: 1,
        customer: "Juan Pérez",
        cashRegister: 1,
        total: 125.5,
        date: new Date("2025-10-20T10:30:00"),
        billDetails: [],
      } as Bill;

      mockRepository.save.mockResolvedValue(savedBill);

      const result = await billService.save(billData);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: "Juan Pérez",
          cashRegister: 1,
          total: 125.5,
          date: new Date("2025-10-20T10:30:00"),
        })
      );
      expect(result).toEqual(savedBill);
    });

    it("debería crear una entidad Bill con los datos correctos", async () => {
      const billData: SaveBillDTO = {
        billId: 0,
        customer: "María García",
        cashRegister: 2,
        total: 75.25,
        date: new Date("2025-10-20T15:45:00"),
      };

      let savedEntity: any;
      mockRepository.save.mockImplementation((bill) => {
        savedEntity = bill;
        return Promise.resolve({ billId: 1, ...bill } as Bill);
      });

      await billService.save(billData);

      expect(savedEntity).toBeInstanceOf(Bill);
      expect(savedEntity.customer).toBe("María García");
      expect(savedEntity.cashRegister).toBe(2);
      expect(savedEntity.total).toBe(75.25);
      expect(savedEntity.date).toEqual(new Date("2025-10-20T15:45:00"));
    });

    it("debería manejar diferentes tipos de datos", async () => {
      const casos = [
        {
          customer: "Cliente 1",
          cashRegister: 1,
          total: 0.0,
          date: new Date("2025-01-01"),
        },
        {
          customer: "Cliente con Nombre Largo y Caracteres Especiales!",
          cashRegister: 99,
          total: 999.99,
          date: new Date("2025-12-31T23:59:59"),
        },
        {
          customer: "",
          cashRegister: 5,
          total: 50.75,
          date: new Date(),
        },
      ];

      for (const caso of casos) {
        const billData: SaveBillDTO = {
          billId: 0,
          ...caso,
        };

        mockRepository.save.mockResolvedValue({} as Bill);

        await billService.save(billData);

        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            customer: caso.customer,
            cashRegister: caso.cashRegister,
            total: caso.total,
            date: caso.date,
          })
        );
      }
    });

    it("debería manejar errores del repositorio", async () => {
      const billData: SaveBillDTO = {
        billId: 0,
        customer: "Test",
        cashRegister: 1,
        total: 10.0,
        date: new Date(),
      };

      const repositoryError = new Error("Error de base de datos");
      mockRepository.save.mockRejectedValue(repositoryError);

      await expect(billService.save(billData)).rejects.toThrow(
        "Error de base de datos"
      );
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it("debería manejar totales con decimales precisos", async () => {
      const billData: SaveBillDTO = {
        billId: 0,
        customer: "Cliente Decimal",
        cashRegister: 1,
        total: 123.456,
        date: new Date(),
      };

      mockRepository.save.mockResolvedValue({} as Bill);

      await billService.save(billData);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 123.456,
        })
      );
    });
  });

  describe("getById", () => {
    it("debería obtener una factura por ID", async () => {
      const billId = 1;
      const mockBill = {
        billId: 1,
        customer: "Ana López",
        cashRegister: 2,
        total: 89.5,
        date: new Date("2025-10-20"),
        billDetails: [],
      } as Bill;

      mockRepository.findOne.mockResolvedValue(mockBill);

      const result = await billService.getById(billId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { billId: 1 },
      });
      expect(result).toEqual(mockBill);
    });

    it("debería retornar null cuando la factura no existe", async () => {
      const billId = 999;
      mockRepository.findOne.mockResolvedValue(null);

      const result = await billService.getById(billId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { billId: 999 },
      });
      expect(result).toBeNull();
    });

    it("debería manejar errores del repositorio", async () => {
      const billId = 1;
      const repositoryError = new Error("Error de consulta");
      mockRepository.findOne.mockRejectedValue(repositoryError);

      await expect(billService.getById(billId)).rejects.toThrow(
        "Error de consulta"
      );
      expect(mockRepository.findOne).toHaveBeenCalled();
    });

    it("debería manejar diferentes IDs", async () => {
      const ids = [1, 100, 999, 5];

      for (const id of ids) {
        mockRepository.findOne.mockResolvedValue({} as Bill);

        await billService.getById(id);

        expect(mockRepository.findOne).toHaveBeenCalledWith({
          where: { billId: id },
        });
      }
    });
  });

  describe("getAll", () => {
    it("debería obtener todas las facturas", async () => {
      const mockBills = [
        {
          billId: 1,
          customer: "Cliente 1",
          cashRegister: 1,
          total: 50.0,
          date: new Date("2025-10-20"),
          billDetails: [],
        },
        {
          billId: 2,
          customer: "Cliente 2",
          cashRegister: 2,
          total: 75.0,
          date: new Date("2025-10-20"),
          billDetails: [],
        },
        {
          billId: 3,
          customer: "Cliente 3",
          cashRegister: 1,
          total: 100.0,
          date: new Date("2025-10-21"),
          billDetails: [],
        },
      ] as Bill[];

      mockRepository.find.mockResolvedValue(mockBills);

      const result = await billService.getAll();

      expect(mockRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual(mockBills);
      expect(result).toHaveLength(3);
    });

    it("debería retornar array vacío cuando no hay facturas", async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await billService.getAll();

      expect(result).toEqual([]);
    });

    it("debería manejar errores del repositorio", async () => {
      const repositoryError = new Error("Error de conexión");
      mockRepository.find.mockRejectedValue(repositoryError);

      await expect(billService.getAll()).rejects.toThrow("Error de conexión");
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it("debería obtener facturas con diferentes estructuras", async () => {
      const mockBills = [
        {
          billId: 1,
          customer: "Cliente Normal",
          cashRegister: 1,
          total: 25.5,
          date: new Date(),
          billDetails: [],
        },
        {
          billId: 2,
          customer: "",
          cashRegister: 2,
          total: 0.0,
          date: new Date(),
          billDetails: [],
        },
      ] as Bill[];

      mockRepository.find.mockResolvedValue(mockBills);

      const result = await billService.getAll();

      expect(result).toEqual(mockBills);
      expect(result[0].customer).toBe("Cliente Normal");
      expect(result[1].customer).toBe("");
      expect(result[1].total).toBe(0.0);
    });
  });

  describe("Métodos no implementados", () => {
    describe("Casos de integración", () => {
      it("debería manejar flujo completo de CRUD básico", async () => {
        const billData: SaveBillDTO = {
          billId: 0,
          customer: "Cliente Integración",
          cashRegister: 3,
          total: 150.75,
          date: new Date("2025-10-20T12:00:00"),
        };

        const savedBill = {
          billId: 5,
          customer: "Cliente Integración",
          cashRegister: 3,
          total: 150.75,
          date: new Date("2025-10-20T12:00:00"),
          billDetails: [],
        } as Bill;

        // 1. Guardar factura
        mockRepository.save.mockResolvedValue(savedBill);
        const saveResult = await billService.save(billData);
        expect(saveResult).toEqual(savedBill);

        // 2. Obtener por ID
        mockRepository.findOne.mockResolvedValue(savedBill);
        const getResult = await billService.getById(5);
        expect(getResult).toEqual(savedBill);

        // 3. Obtener todas las facturas
        mockRepository.find.mockResolvedValue([savedBill]);
        const getAllResult = await billService.getAll();
        expect(getAllResult).toContain(savedBill);
      });

      it("debería manejar múltiples facturas del mismo cliente", async () => {
        const cliente = "Cliente Frecuente";
        const facturas = [
          {
            billId: 0,
            customer: cliente,
            cashRegister: 1,
            total: 25.0,
            date: new Date("2025-10-20T09:00:00"),
          },
          {
            billId: 0,
            customer: cliente,
            cashRegister: 1,
            total: 35.5,
            date: new Date("2025-10-20T14:30:00"),
          },
          {
            billId: 0,
            customer: cliente,
            cashRegister: 2,
            total: 50.75,
            date: new Date("2025-10-20T18:45:00"),
          },
        ];

        for (let i = 0; i < facturas.length; i++) {
          const factura = facturas[i];
          const savedBill = { ...factura, billId: i + 1 } as Bill;

          mockRepository.save.mockResolvedValueOnce(savedBill);

          const result = await billService.save(factura);

          expect(result.customer).toBe(cliente);
          expect(result.billId).toBe(i + 1);
        }
      });

      it("debería manejar diferentes cajas registradoras", async () => {
        const cajas = [1, 2, 3, 5, 10];

        for (const caja of cajas) {
          const billData: SaveBillDTO = {
            billId: 0,
            customer: `Cliente Caja ${caja}`,
            cashRegister: caja,
            total: 30.0,
            date: new Date(),
          };

          mockRepository.save.mockResolvedValue({} as Bill);

          await billService.save(billData);

          expect(mockRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
              cashRegister: caja,
            })
          );
        }
      });

      it("debería manejar rangos de fechas", async () => {
        const fechas = [
          new Date("2025-01-01T00:00:00"),
          new Date("2025-06-15T12:30:00"),
          new Date("2025-10-20T23:59:59"),
          new Date("2025-12-31T18:00:00"),
        ];

        for (const fecha of fechas) {
          const billData: SaveBillDTO = {
            billId: 0,
            customer: "Cliente Fecha",
            cashRegister: 1,
            total: 25.0,
            date: fecha,
          };

          mockRepository.save.mockResolvedValue({} as Bill);

          await billService.save(billData);

          expect(mockRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
              date: fecha,
            })
          );
        }
      });
    });

    describe("Validaciones de datos", () => {
      it("debería manejar nombres de cliente con caracteres especiales", async () => {
        const nombresEspeciales = [
          "José María Fernández-López",
          "Ana & Co. Café",
          'Restaurante "El Buen Sabor"',
          "Café 100% Orgánico",
          "María José Martínez Jr.",
        ];

        for (const nombre of nombresEspeciales) {
          const billData: SaveBillDTO = {
            billId: 0,
            customer: nombre,
            cashRegister: 1,
            total: 50.0,
            date: new Date(),
          };

          mockRepository.save.mockResolvedValue({} as Bill);

          await billService.save(billData);

          expect(mockRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
              customer: nombre,
            })
          );
        }
      });

      it("debería manejar totales extremos", async () => {
        const totalesExtremos = [
          0.01, // Mínimo
          0.0, // Cero
          999.99, // Alto
          1000.0, // Exacto
          9999.99, // Muy alto
        ];

        for (const total of totalesExtremos) {
          const billData: SaveBillDTO = {
            billId: 0,
            customer: "Cliente Total",
            cashRegister: 1,
            total: total,
            date: new Date(),
          };

          mockRepository.save.mockResolvedValue({} as Bill);

          await billService.save(billData);

          expect(mockRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
              total: total,
            })
          );
        }
      });

      it("debería manejar IDs de caja registradora diversos", async () => {
        const cajasEspeciales = [0, 1, 99, 100, 999];

        for (const caja of cajasEspeciales) {
          const billData: SaveBillDTO = {
            billId: 0,
            customer: "Cliente",
            cashRegister: caja,
            total: 25.0,
            date: new Date(),
          };

          mockRepository.save.mockResolvedValue({} as Bill);

          await billService.save(billData);

          expect(mockRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
              cashRegister: caja,
            })
          );
        }
      });

      it("debería manejar fechas en diferentes formatos", async () => {
        const fecha1 = new Date("2025-10-20");
        const fecha2 = new Date("2025-10-20T15:30:45");
        const fecha3 = new Date("2025-10-20T15:30:45.123Z");
        const fecha4 = new Date(2025, 9, 20, 15, 30, 45); // Mes base-0

        const fechas = [fecha1, fecha2, fecha3, fecha4];

        for (const fecha of fechas) {
          const billData: SaveBillDTO = {
            billId: 0,
            customer: "Cliente Fecha",
            cashRegister: 1,
            total: 25.0,
            date: fecha,
          };

          mockRepository.save.mockResolvedValue({} as Bill);

          await billService.save(billData);

          expect(mockRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
              date: fecha,
            })
          );
        }
      });
    });
  });
});
