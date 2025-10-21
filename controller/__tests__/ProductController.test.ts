import * as productController from "../ProductController";
import { IService } from "../../core/interfaces/IService";
import { productSchema } from "../../application/validations/ProductValidations";

jest.mock("../../application/validations/ProductValidations");
const mockedProductSchema = productSchema as jest.Mocked<typeof productSchema>;

describe("ProductController", () => {
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
    productController.setService(mockService);

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

  describe("saveProduct", () => {
    it("debería guardar el producto exitosamente", async () => {
      const datosProducto = {
        name: "Café Americano",
        description: "Café negro clásico",
        price: "3.50",
        cost: "1.20",
      };

      const datosValidados = {
        name: "Café Americano",
        description: "Café negro clásico",
        price: 3.50,
        cost: 1.20,
      };

      const productoGuardado = { 
        productId: 1, 
        ...datosValidados 
      };

      mockReq.body = datosProducto;
      mockedProductSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(productoGuardado);

      await productController.saveProduct(mockReq, mockRes);

      expect(mockedProductSchema.parse).toHaveBeenCalledWith(datosProducto);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        message: "El producto se guardo correctamente",
        data: productoGuardado,
      });
      expect(console.log).toHaveBeenCalledWith("Producto guardado correctamente");
    });

    it("debería manejar errores de validación ZodError para nombre vacío", async () => {
      const datosInvalidos = {
        name: "",
        description: "Descripción válida",
        price: "3.50",
        cost: "1.20",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El nombre no puede estar vacio",
            path: ["name"],
            code: "too_small",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedProductSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await productController.saveProduct(mockReq, mockRes);

      expect(mockedProductSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El nombre no puede estar vacio",
        campo: ["name"],
        error: "too_small",
      });
      expect(console.log).not.toHaveBeenCalledWith("Producto guardado correctamente");
    });

    it("debería manejar errores de validación ZodError para nombre muy largo", async () => {
      const nombreMuyLargo = "a".repeat(51);
      const datosInvalidos = {
        name: nombreMuyLargo,
        description: "Descripción válida",
        price: "3.50",
        cost: "1.20",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El nombre no puede ser mayor a 50 caracteres",
            path: ["name"],
            code: "too_big",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedProductSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await productController.saveProduct(mockReq, mockRes);

      expect(mockedProductSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El nombre no puede ser mayor a 50 caracteres",
        campo: ["name"],
        error: "too_big",
      });
    });

    it("debería manejar errores de validación ZodError para descripción vacía", async () => {
      const datosInvalidos = {
        name: "Café Americano",
        description: "",
        price: "3.50",
        cost: "1.20",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El nombre del cliente no puede estar vacío",
            path: ["description"],
            code: "too_small",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedProductSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await productController.saveProduct(mockReq, mockRes);

      expect(mockedProductSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El nombre del cliente no puede estar vacío",
        campo: ["description"],
        error: "too_small",
      });
    });

    it("debería manejar errores de validación ZodError para descripción muy larga", async () => {
      const descripcionMuyLarga = "a".repeat(101);
      const datosInvalidos = {
        name: "Café Americano",
        description: descripcionMuyLarga,
        price: "3.50",
        cost: "1.20",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El nombre del cliente es muy largo",
            path: ["description"],
            code: "too_big",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedProductSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await productController.saveProduct(mockReq, mockRes);

      expect(mockedProductSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El nombre del cliente es muy largo",
        campo: ["description"],
        error: "too_big",
      });
    });

    it("debería manejar errores de validación ZodError para precio inválido", async () => {
      const datosInvalidos = {
        name: "Café Americano",
        description: "Café negro clásico",
        price: "0",
        cost: "1.20",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El precio debe ser mayor a 0",
            path: ["price"],
            code: "custom",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedProductSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await productController.saveProduct(mockReq, mockRes);

      expect(mockedProductSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El precio debe ser mayor a 0",
        campo: ["price"],
        error: "custom",
      });
    });

    it("debería manejar errores de validación ZodError para precio no numérico", async () => {
      const datosInvalidos = {
        name: "Café Americano",
        description: "Café negro clásico",
        price: "invalid",
        cost: "1.20",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El precio debe ser mayor a 0",
            path: ["price"],
            code: "custom",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedProductSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await productController.saveProduct(mockReq, mockRes);

      expect(mockedProductSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El precio debe ser mayor a 0",
        campo: ["price"],
        error: "custom",
      });
    });

    it("debería manejar errores de validación ZodError para costo inválido", async () => {
      const datosInvalidos = {
        name: "Café Americano",
        description: "Café negro clásico",
        price: "3.50",
        cost: "0",
      };
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "El costo debe ser mayor a 0",
            path: ["cost"],
            code: "custom",
          },
        ],
      };

      mockReq.body = datosInvalidos;
      mockedProductSchema.parse.mockImplementation(() => {
        throw errorZod;
      });

      await productController.saveProduct(mockReq, mockRes);

      expect(mockedProductSchema.parse).toHaveBeenCalledWith(datosInvalidos);
      expect(mockService.save).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: El costo debe ser mayor a 0",
        campo: ["cost"],
        error: "custom",
      });
    });

    it("debería manejar errores generales del servidor", async () => {
      const datosProducto = {
        name: "Café Americano",
        description: "Café negro clásico",
        price: "3.50",
        cost: "1.20",
      };

      const datosValidados = {
        name: "Café Americano",
        description: "Café negro clásico",
        price: 3.50,
        cost: 1.20,
      };

      const errorServidor = new Error("Error interno del servidor");

      mockReq.body = datosProducto;
      mockedProductSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockRejectedValue(errorServidor);

      await productController.saveProduct(mockReq, mockRes);

      expect(mockedProductSchema.parse).toHaveBeenCalledWith(datosProducto);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Hubo en error en el servidor al guardar el producto",
        errors: errorServidor,
      });
      expect(console.log).toHaveBeenCalledWith("Error interno del servidor");
      expect(console.log).not.toHaveBeenCalledWith("Producto guardado correctamente");
    });

    it("debería manejar transformaciones de string a number correctamente", async () => {
      const datosProducto = {
        name: "Latte",
        description: "Café con leche espumosa",
        price: "4.75",
        cost: "2.10",
      };

      const datosValidados = {
        name: "Latte",
        description: "Café con leche espumosa",
        price: 4.75,
        cost: 2.10,
      };

      const productoGuardado = { 
        productId: 2, 
        ...datosValidados 
      };

      mockReq.body = datosProducto;
      mockedProductSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(productoGuardado);

      await productController.saveProduct(mockReq, mockRes);

      expect(mockedProductSchema.parse).toHaveBeenCalledWith(datosProducto);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        message: "El producto se guardo correctamente",
        data: productoGuardado,
      });
    });

    it("debería manejar nombres y descripciones con espacios (trim)", async () => {
      const datosConEspacios = {
        name: "   Cappuccino   ",
        description: "   Café con espuma de leche   ",
        price: "4.00",
        cost: "1.80",
      };

      const datosLimpios = {
        name: "Cappuccino",
        description: "Café con espuma de leche",
        price: 4.00,
        cost: 1.80,
      };

      const productoGuardado = { 
        productId: 3, 
        ...datosLimpios 
      };

      mockReq.body = datosConEspacios;
      mockedProductSchema.parse.mockReturnValue(datosLimpios);
      mockService.save.mockResolvedValue(productoGuardado);

      await productController.saveProduct(mockReq, mockRes);

      expect(mockedProductSchema.parse).toHaveBeenCalledWith(datosConEspacios);
      expect(mockService.save).toHaveBeenCalledWith(datosLimpios);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe("getProducts", () => {
    it("debería retornar los productos exitosamente", async () => {
      const productosSimulados = [
        {
          productId: 1,
          name: "Café Americano",
          description: "Café negro clásico",
          price: 3.50,
          cost: 1.20,
        },
        {
          productId: 2,
          name: "Latte",
          description: "Café con leche espumosa",
          price: 4.75,
          cost: 2.10,
        },
      ];

      const productosDTO = [
        {
          productId: 1,
          name: "Café Americano",
          description: "Café negro clásico",
          price: 3.50,
          cost: 1.20,
        },
        {
          productId: 2,
          name: "Latte",
          description: "Café con leche espumosa",
          price: 4.75,
          cost: 2.10,
        },
      ];

      mockService.getAll.mockResolvedValue(productosSimulados);

      await productController.getProducts(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        data: productosDTO,
      });
      expect(console.log).toHaveBeenCalledWith("Productos obtenidos correctamente");
    });

    it("debería manejar errores ZodError (caso poco probable pero contemplado)", async () => {
      const errorZod = {
        name: "ZodError",
        issues: [
          {
            message: "Error de validación inesperado",
            path: ["unexpected"],
            code: "custom",
          },
        ],
      };

      mockService.getAll.mockRejectedValue(errorZod);

      await productController.getProducts(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: Error de validación inesperado",
        campo: ["unexpected"],
        error: "custom",
      });
      expect(console.log).not.toHaveBeenCalledWith("Productos obtenidos correctamente");
    });

    it("debería manejar errores al obtener los productos", async () => {
      const errorServidor = new Error("Error de conexión a la base de datos");
      errorServidor.name = "DatabaseError";

      mockService.getAll.mockRejectedValue(errorServidor);

      await productController.getProducts(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Error al obtener los productos",
        errors: undefined,
      });
      expect(console.log).not.toHaveBeenCalledWith("Productos obtenidos correctamente");
    });

    it("debería manejar errores con issues", async () => {
      const errorConIssues = {
        name: "CustomError",
        issues: ["Issue 1", "Issue 2"],
      };

      mockService.getAll.mockRejectedValue(errorConIssues);

      await productController.getProducts(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Error al obtener los productos",
        errors: ["Issue 1", "Issue 2"],
      });
    });

    it("debería manejar errores con errors", async () => {
      const errorConErrors = {
        name: "ValidationError",
        errors: ["Error 1", "Error 2"],
      };

      mockService.getAll.mockRejectedValue(errorConErrors);

      await productController.getProducts(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Error al obtener los productos",
        errors: ["Error 1", "Error 2"],
      });
    });

    it("debería retornar un array vacío cuando no hay productos", async () => {
      const productosVacios: any[] = [];

      mockService.getAll.mockResolvedValue(productosVacios);

      await productController.getProducts(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        data: [],
      });
      expect(console.log).toHaveBeenCalledWith("Productos obtenidos correctamente");
    });

    it("debería mapear correctamente los productos a DTOs", async () => {
      const productosConCamposExtra = [
        {
          productId: 1,
          name: "Espresso",
          description: "Café concentrado",
          price: 2.50,
          cost: 0.80,
          extraField: "should be ignored",
          anotherField: 123,
        },
      ];

      const expectedDTO = [
        {
          productId: 1,
          name: "Espresso",
          description: "Café concentrado",
          price: 2.50,
          cost: 0.80,
        },
      ];

      mockService.getAll.mockResolvedValue(productosConCamposExtra);

      await productController.getProducts(mockReq, mockRes);

      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        data: expectedDTO,
      });
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

      expect(() => productController.setService(nuevoServicio)).not.toThrow();

      // Verificar que el servicio se estableció correctamente
      // ejecutando una función que lo use
      nuevoServicio.getAll.mockResolvedValue([]);
      await productController.getProducts(mockReq, mockRes);

      expect(nuevoServicio.getAll).toHaveBeenCalled();
    });
  });

  describe("Casos con diferentes tipos de productos", () => {
    const tiposDeProductos = [
      { name: "Espresso", description: "Café concentrado italiano", price: "2.50", cost: "0.80" },
      { name: "Americano", description: "Café negro clásico", price: "3.00", cost: "1.00" },
      { name: "Latte", description: "Café con leche espumosa", price: "4.50", cost: "2.00" },
      { name: "Cappuccino", description: "Café con espuma de leche", price: "4.00", cost: "1.80" },
      { name: "Mocha", description: "Café con chocolate", price: "5.00", cost: "2.50" },
      { name: "Frappé", description: "Café frío batido", price: "5.50", cost: "2.80" },
    ];

    tiposDeProductos.forEach((producto) => {
      it(`debería guardar producto: "${producto.name}"`, async () => {
        const datosValidados = {
          name: producto.name,
          description: producto.description,
          price: parseFloat(producto.price),
          cost: parseFloat(producto.cost),
        };

        const productoGuardado = { 
          productId: 1, 
          ...datosValidados 
        };

        mockReq.body = producto;
        mockedProductSchema.parse.mockReturnValue(datosValidados);
        mockService.save.mockResolvedValue(productoGuardado);

        await productController.saveProduct(mockReq, mockRes);

        expect(mockedProductSchema.parse).toHaveBeenCalledWith(producto);
        expect(mockService.save).toHaveBeenCalledWith(datosValidados);
        expect(mockRes.status).toHaveBeenCalledWith(201);
      });
    });
  });

  describe("Casos límite de validación", () => {
    it("debería manejar nombre con exactamente 1 carácter", async () => {
      const datosMinimos = {
        name: "A",
        description: "B",
        price: "0.01",
        cost: "0.01",
      };

      const datosValidados = {
        name: "A",
        description: "B",
        price: 0.01,
        cost: 0.01,
      };

      const productoGuardado = { 
        productId: 1, 
        ...datosValidados 
      };

      mockReq.body = datosMinimos;
      mockedProductSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(productoGuardado);

      await productController.saveProduct(mockReq, mockRes);

      expect(mockedProductSchema.parse).toHaveBeenCalledWith(datosMinimos);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("debería manejar nombre con exactamente 50 caracteres", async () => {
      const nombreMaximo = "a".repeat(50);
      const descripcionMaxima = "b".repeat(100);
      const datosMaximos = {
        name: nombreMaximo,
        description: descripcionMaxima,
        price: "999.99",
        cost: "499.99",
      };

      const datosValidados = {
        name: nombreMaximo,
        description: descripcionMaxima,
        price: 999.99,
        cost: 499.99,
      };

      const productoGuardado = { 
        productId: 1, 
        ...datosValidados 
      };

      mockReq.body = datosMaximos;
      mockedProductSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(productoGuardado);

      await productController.saveProduct(mockReq, mockRes);

      expect(mockedProductSchema.parse).toHaveBeenCalledWith(datosMaximos);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("debería manejar precios decimales con múltiples dígitos", async () => {
      const datosDecimales = {
        name: "Producto Premium",
        description: "Descripción del producto premium",
        price: "12.345",
        cost: "6.789",
      };

      const datosValidados = {
        name: "Producto Premium",
        description: "Descripción del producto premium",
        price: 12.345,
        cost: 6.789,
      };

      const productoGuardado = { 
        productId: 1, 
        ...datosValidados 
      };

      mockReq.body = datosDecimales;
      mockedProductSchema.parse.mockReturnValue(datosValidados);
      mockService.save.mockResolvedValue(productoGuardado);

      await productController.saveProduct(mockReq, mockRes);

      expect(mockedProductSchema.parse).toHaveBeenCalledWith(datosDecimales);
      expect(mockService.save).toHaveBeenCalledWith(datosValidados);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });
});
