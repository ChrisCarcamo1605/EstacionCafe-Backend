import { Repository } from "typeorm";
import { BillDetailsService } from "../BillDetailsService";
import { BillDetails } from "../../../core/entities/BillDetails";
import { SaveBillDetailDTO } from "../../DTOs/BillsDTO";
import { IService } from "../../../core/interfaces/IService";
import { Bill } from "../../../core/entities/Bill";

describe("BillDetailsService", () => {
  let billDetailsService: BillDetailsService;
  let mockDetailRepo: jest.Mocked<Repository<BillDetails>>;
  let mockBillService: jest.Mocked<IService>;

  beforeEach(() => {
    // Crear mock del repositorio de detalles
    mockDetailRepo = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    } as any;

    // Crear mock del servicio de facturasAA
    mockBillService = {
      save: jest.fn(),
      saveAll: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
    };

    // Crear instancia del servicio con los mocks
    billDetailsService = new BillDetailsService(
      mockDetailRepo,
      mockBillService
    );

    // Limpiar console.log
    jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getById", () => {
    it("debería obtener detalles de factura por ID con relaciones", async () => {
      const billId = 1;
      const mockDetails = [
        {
          billDetailId: 1,
          billId: 1,
          productId: 1,
          quantity: 2,
          subTotal: 50.0,
          product: { productId: 1, name: "Café Americano", price: 25.0 },
          bill: { billId: 1, customer: "Juan Pérez", total: 100.0 },
        },
        {
          billDetailId: 2,
          billId: 1,
          productId: 2,
          quantity: 1,
          subTotal: 50.0,
          product: { productId: 2, name: "Cappuccino", price: 50.0 },
          bill: { billId: 1, customer: "Juan Pérez", total: 100.0 },
        },
      ] as BillDetails[];

      mockDetailRepo.find.mockResolvedValue(mockDetails);

      const result = await billDetailsService.getById(billId);

      expect(mockDetailRepo.find).toHaveBeenCalledWith({
        where: { billId: 1 },
        relations: ["product", "bill"],
      });
      expect(result).toEqual(mockDetails);
      expect(result).toHaveLength(2);
      expect(console.log).toHaveBeenCalledWith("Obteniendo detalles de la factura 1...");
    });

    it("debería retornar array vacío cuando no hay detalles", async () => {
      const billId = 999;
      mockDetailRepo.find.mockResolvedValue([]);

      const result = await billDetailsService.getById(billId);

      expect(mockDetailRepo.find).toHaveBeenCalledWith({
        where: { billId: 999 },
        relations: ["product", "bill"],
      });
      expect(result).toEqual([]);
      expect(console.log).toHaveBeenCalledWith("Obteniendo detalles de la factura 999...");
    });

    it("debería manejar errores del repositorio", async () => {
      const billId = 1;
      const repositoryError = new Error("Error de base de datos");
      mockDetailRepo.find.mockRejectedValue(repositoryError);

      await expect(billDetailsService.getById(billId)).rejects.toThrow(
        "Error de base de datos"
      );
      expect(mockDetailRepo.find).toHaveBeenCalled();
    });
  });

  describe("saveAll", () => {
    it("debería guardar factura completa con detalles exitosamente", async () => {
      const billDetailData: SaveBillDetailDTO = {
        customer: "María García",
        cashRegister: 1,
        date: new Date("2025-10-20"),
        billDetails: [
          {
            productId: 1,
            quantity: 2,
            subTotal: 60.0,
          },
          {
            productId: 2,
            quantity: 1,
            subTotal: 40.0,
          },
        ],
      };

      const savedBill = {
        billId: 1,
        customer: "María García",
        cashRegisterId: 1,
        total: 100.0,
        date: new Date("2025-10-20"),
        billDetails: [],
        cashRegister: {} as any,
      } as Bill;

      const savedDetails = [
        {
          billDetailId: 1,
          billId: 1,
          productId: 1,
          quantity: 2,
          subTotal: 60.0,
        },
        {
          billDetailId: 2,
          billId: 1,
          productId: 2,
          quantity: 1,
          subTotal: 40.0,
        },
      ] as BillDetails[];

      mockBillService.save.mockResolvedValue(savedBill);
      mockDetailRepo.save.mockResolvedValue(savedDetails as any);

      const result = await billDetailsService.saveAll(billDetailData);

      // Verificar que se guardó la factura con total calculado
      expect(mockBillService.save).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: "María García",
          cashRegister: 1,
          total: 100.0, // Suma de subtotales
          date: new Date("2025-10-20"),
        })
      );

      // Verificar que se guardaron los detalles
      expect(mockDetailRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            billId: 1,
            productId: 1,
            quantity: 2,
            subTotal: 60.0,
          }),
          expect.objectContaining({
            billId: 1,
            productId: 2,
            quantity: 1,
            subTotal: 40.0,
          }),
        ])
      );

      expect(result).toEqual(savedDetails);
      expect(console.log).toHaveBeenCalledWith("entrando al save all");
      expect(console.log).toHaveBeenCalledWith("Guardando factura...");
      expect(console.log).toHaveBeenCalledWith("Guardando detalles de la factura...");
    });

    it("debería calcular el total correctamente", async () => {
      const billDetailData: SaveBillDetailDTO = {
        customer: "Test Customer",
        cashRegister: 1,
        date: new Date(),
        billDetails: [
          { productId: 1, quantity: 3, subTotal: 75.5 },
          { productId: 2, quantity: 2, subTotal: 60.0 },
          { productId: 3, quantity: 1, subTotal: 25.75 },
        ],
      };

      const savedBill = { billId: 1 } as Bill;
      mockBillService.save.mockResolvedValue(savedBill);
      mockDetailRepo.save.mockResolvedValue([] as any);

      await billDetailsService.saveAll(billDetailData);

      expect(mockBillService.save).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 161.25, // 75.50 + 60.00 + 25.75
        })
      );
    });

    it("debería crear entidades BillDetails correctamente", async () => {
      const billDetailData: SaveBillDetailDTO = {
        customer: "Test",
        cashRegister: 1,
        date: new Date(),
        billDetails: [{ productId: 5, quantity: 1, subTotal: 30.0 }],
      };

      const savedBill = { 
        billId: 10,
        customer: "",
        cashRegisterId: 1,
        total: 0,
        date: new Date(),
        billDetails: [],
        cashRegister: {} as any,
      } as Bill;
      let savedDetails: any[];

      mockBillService.save.mockResolvedValue(savedBill);
      mockDetailRepo.save.mockImplementation((details: any) => {
        savedDetails = details as any[];
        return Promise.resolve(details as any);
      });

      await billDetailsService.saveAll(billDetailData);

      expect(savedDetails![0]).toBeInstanceOf(BillDetails);
      expect(savedDetails![0].billId).toBe(10);
      expect(savedDetails![0].productId).toBe(5);
      expect(savedDetails![0].quantity).toBe(1);
      expect(savedDetails![0].subTotal).toBe(30.0);
    });

    it("debería manejar factura sin detalles", async () => {
      const billDetailData: SaveBillDetailDTO = {
        customer: "Cliente Sin Compras",
        cashRegister: 1,
        date: new Date(),
        billDetails: [],
      };

      const savedBill = { 
        billId: 1,
        customer: "",
        cashRegisterId: 1,
        total: 0,
        date: new Date(),
        billDetails: [],
        cashRegister: {} as any,
      } as Bill;
      mockBillService.save.mockResolvedValue(savedBill);
      mockDetailRepo.save.mockResolvedValue([] as any);

      const result = await billDetailsService.saveAll(billDetailData);

      expect(mockBillService.save).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 0,
        })
      );
      expect(mockDetailRepo.save).toHaveBeenCalledWith([]);
      expect(result).toEqual([]);
    });

    it("debería manejar errores del servicio de facturas", async () => {
      const billDetailData: SaveBillDetailDTO = {
        customer: "Test",
        cashRegister: 1,
        date: new Date(),
        billDetails: [{ productId: 1, quantity: 1, subTotal: 10.0 }],
      };

      const billError = new Error("Error al guardar factura");
      mockBillService.save.mockRejectedValue(billError);

      await expect(billDetailsService.saveAll(billDetailData)).rejects.toThrow(
        "Error al guardar factura"
      );
      expect(mockDetailRepo.save).not.toHaveBeenCalled();
    });

    it("debería manejar errores del repositorio de detalles", async () => {
      const billDetailData: SaveBillDetailDTO = {
        customer: "Test",
        cashRegister: 1,
        date: new Date(),
        billDetails: [{ productId: 1, quantity: 1, subTotal: 10.0 }],
      };

      const savedBill = { 
        billId: 1,
        customer: "",
        cashRegisterId: 1,
        total: 0,
        date: new Date(),
        billDetails: [],
        cashRegister: {} as any,
      } as Bill;
      const detailError = new Error("Error al guardar detalles");

      mockBillService.save.mockResolvedValue(savedBill);
      mockDetailRepo.save.mockRejectedValue(detailError);

      await expect(billDetailsService.saveAll(billDetailData)).rejects.toThrow(
        "Error al guardar detalles"
      );
    });
  });

  describe("getAll", () => {
    it("debería obtener todos los detalles con relaciones", async () => {
      const mockAllDetails = [
        {
          billDetailId: 1,
          billId: 1,
          productId: 1,
          quantity: 2,
          subTotal: 50.0,
          product: { productId: 1, name: "Espresso" },
          bill: { billId: 1, customer: "Cliente 1" },
        },
        {
          billDetailId: 2,
          billId: 2,
          productId: 2,
          quantity: 1,
          subTotal: 30.0,
          product: { productId: 2, name: "Latte" },
          bill: { billId: 2, customer: "Cliente 2" },
        },
      ] as BillDetails[];

      mockDetailRepo.find.mockResolvedValue(mockAllDetails);

      const result = await billDetailsService.getAll();

      expect(mockDetailRepo.find).toHaveBeenCalledWith({
        relations: ["product", "bill"],
      });
      expect(result).toEqual(mockAllDetails);
      expect(result).toHaveLength(2);
      expect(console.log).toHaveBeenCalledWith("Obteniendo bills details...");
    });

    it("debería retornar array vacío cuando no hay detalles", async () => {
      mockDetailRepo.find.mockResolvedValue([]);

      const result = await billDetailsService.getAll();

      expect(result).toEqual([]);
      expect(console.log).toHaveBeenCalledWith("Obteniendo bills details...");
    });

    it("debería manejar errores del repositorio", async () => {
      const repositoryError = new Error("Error de consulta");
      mockDetailRepo.find.mockRejectedValue(repositoryError);

      await expect(billDetailsService.getAll()).rejects.toThrow(
        "Error de consulta"
      );
    });
  });

  describe("delete", () => {
    it("debería eliminar un detalle de factura exitosamente", async () => {
      const detailId = 1;
      const deleteResult = { affected: 1 };

      mockDetailRepo.delete.mockResolvedValue(deleteResult as any);

      const result = await billDetailsService.delete(detailId);

      expect(mockDetailRepo.delete).toHaveBeenCalledWith(detailId);
      expect(result).toEqual({
        message: "Detalle eliminado correctamente",
        id: detailId,
      });
    });

    it("debería lanzar error cuando el detalle no existe", async () => {
      const detailId = 999;
      const deleteResult = { affected: 0 };

      mockDetailRepo.delete.mockResolvedValue(deleteResult as any);

      await expect(billDetailsService.delete(detailId)).rejects.toThrow(
        `Detalle con ID ${detailId} no encontrado`
      );
      expect(mockDetailRepo.delete).toHaveBeenCalledWith(detailId);
    });

    it("debería manejar errores del repositorio", async () => {
      const detailId = 1;
      const repositoryError = new Error("Error de eliminación");

      mockDetailRepo.delete.mockRejectedValue(repositoryError);

      await expect(billDetailsService.delete(detailId)).rejects.toThrow("Error de eliminación");
      expect(mockDetailRepo.delete).toHaveBeenCalledWith(detailId);
    });
  });

  describe("Casos de integración", () => {
    it("debería manejar flujo completo de creación de factura", async () => {
      const billDetailData: SaveBillDetailDTO = {
        customer: "Cliente Integración",
        cashRegister: 2,
        date: new Date("2025-10-20T10:30:00"),
        billDetails: [
          { productId: 1, quantity: 2, subTotal: 70.0 },
          { productId: 3, quantity: 1, subTotal: 45.0 },
        ],
      };

      const savedBill = {
        billId: 100,
        customer: "Cliente Integración",
        cashRegisterId: 2,
        total: 115.0,
        date: new Date("2025-10-20T10:30:00"),
        billDetails: [],
        cashRegister: {} as any,
      } as Bill;

      const savedDetails = [
        {
          billDetailId: 201,
          billId: 100,
          productId: 1,
          quantity: 2,
          subTotal: 70.0,
        },
        {
          billDetailId: 202,
          billId: 100,
          productId: 3,
          quantity: 1,
          subTotal: 45.0,
        },
      ] as BillDetails[];

      mockBillService.save.mockResolvedValue(savedBill);
      mockDetailRepo.save.mockResolvedValue(savedDetails as any);

      // 1. Crear factura con detalles
      const saveResult = await billDetailsService.saveAll(billDetailData);
      expect(saveResult).toEqual(savedDetails);

      // 2. Obtener detalles por ID de factura
      mockDetailRepo.find.mockResolvedValue(savedDetails);
      const getResult = await billDetailsService.getById(100);
      expect(getResult).toEqual(savedDetails);

      // 3. Obtener todos los detalles
      mockDetailRepo.find.mockResolvedValue([...savedDetails]);
      const getAllResult = await billDetailsService.getAll();
      expect(getAllResult).toEqual(savedDetails);
    });

    it("debería manejar múltiples productos con diferentes cantidades", async () => {
      const productos = [
        { productId: 1, quantity: 5, subTotal: 125.0 }, // 25.00 c/u
        { productId: 2, quantity: 3, subTotal: 180.0 }, // 60.00 c/u
        { productId: 3, quantity: 1, subTotal: 35.5 }, // 35.50 c/u
        { productId: 4, quantity: 2, subTotal: 80.0 }, // 40.00 c/u
      ];

      const billDetailData: SaveBillDetailDTO = {
        customer: "Cliente Múltiples Productos",
        cashRegister: 1,
        date: new Date(),
        billDetails: productos,
      };

      const savedBill = { 
        billId: 1,
        customer: "",
        cashRegisterId: 1,
        total: 0,
        date: new Date(),
        billDetails: [],
        cashRegister: {} as any,
      } as Bill;
      mockBillService.save.mockResolvedValue(savedBill);

      await billDetailsService.saveAll(billDetailData);

      expect(mockBillService.save).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 420.5, // Suma de todos los subtotales
        })
      );

      expect(mockDetailRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining(
          productos.map((producto) =>
            expect.objectContaining({
              billId: 1,
              productId: producto.productId,
              quantity: producto.quantity,
              subTotal: producto.subTotal,
            })
          )
        )
      );
    });

    it("debería manejar decimales precisos en subtotales", async () => {
      const billDetailData: SaveBillDetailDTO = {
        customer: "Test Decimales",
        cashRegister: 1,
        date: new Date(),
        billDetails: [
          { productId: 1, quantity: 3, subTotal: 33.33 },
          { productId: 2, quantity: 2, subTotal: 66.67 },
        ],
      };

      const savedBill = { 
        billId: 1,
        customer: "",
        cashRegisterId: 1,
        total: 0,
        date: new Date(),
        billDetails: [],
        cashRegister: {} as any,
      } as Bill;
      mockBillService.save.mockResolvedValue(savedBill);
      mockDetailRepo.save.mockResolvedValue([] as any);

      await billDetailsService.saveAll(billDetailData);

      expect(mockBillService.save).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 100.0, // 33.33 + 66.67
        })
      );
    });
  });

  describe("Validaciones de datos", () => {
    it("debería manejar cantidades cero", async () => {
      const billDetailData: SaveBillDetailDTO = {
        customer: "Test Cantidad Cero",
        cashRegister: 1,
        date: new Date(),
        billDetails: [{ productId: 1, quantity: 0, subTotal: 0.0 }],
      };

      const savedBill = { 
        billId: 1,
        customer: "",
        cashRegisterId: 1,
        total: 0,
        date: new Date(),
        billDetails: [],
        cashRegister: {} as any,
      } as Bill;
      mockBillService.save.mockResolvedValue(savedBill);
      mockDetailRepo.save.mockResolvedValue([] as any);

      await billDetailsService.saveAll(billDetailData);

      expect(mockBillService.save).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 0.0,
        })
      );
    });

    it("debería manejar diferentes IDs de caja registradora", async () => {
      const cajas = [1, 2, 5, 10];

      for (const cajaId of cajas) {
        const billDetailData: SaveBillDetailDTO = {
          customer: `Cliente Caja ${cajaId}`,
          cashRegister: cajaId,
          date: new Date(),
          billDetails: [{ productId: 1, quantity: 1, subTotal: 25.0 }],
        };

        const savedBill = { 
          billId: 1,
          customer: "",
          cashRegisterId: 1,
          total: 0,
          date: new Date(),
          billDetails: [],
          cashRegister: {} as any,
        } as Bill;
        mockBillService.save.mockResolvedValue(savedBill);

        await billDetailsService.saveAll(billDetailData);

        expect(mockBillService.save).toHaveBeenCalledWith(
          expect.objectContaining({
            cashRegister: cajaId,
          })
        );
      }
    });

    it("debería manejar nombres de cliente con caracteres especiales", async () => {
      const clientes = [
        "José María Martínez",
        "Ana-Sofía López",
        "Dr. Roberto Rodríguez Jr.",
        "María José & Co.",
      ];

      for (const cliente of clientes) {
        const billDetailData: SaveBillDetailDTO = {
          customer: cliente,
          cashRegister: 1,
          date: new Date(),
          billDetails: [{ productId: 1, quantity: 1, subTotal: 10.0 }],
        };

        const savedBill = { 
          billId: 1,
          customer: "",
          cashRegisterId: 1,
          total: 0,
          date: new Date(),
          billDetails: [],
          cashRegister: {} as any,
        } as Bill;
        mockBillService.save.mockResolvedValue(savedBill);
        mockDetailRepo.save.mockResolvedValue([] as any);

        await billDetailsService.saveAll(billDetailData);

        expect(mockBillService.save).toHaveBeenCalledWith(
          expect.objectContaining({
            customer: cliente,
          })
        );
      }
    });
  });
});
