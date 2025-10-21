import { Repository } from "typeorm";
import { ProductService } from "../ProductService";
import { Product } from "../../../core/entities/Producto";

describe("ProductService", () => {
  let productService: ProductService;
  let mockRepository: jest.Mocked<Repository<Product>>;

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
    productService = new ProductService(mockRepository);

    // Limpiar console.log
    jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("save", () => {
    it("debería guardar un producto exitosamente", async () => {
      const productData = {
        productId: 1,
        name: "Café Americano",
        description: "Café negro americano clásico",
        price: 25.50,
        cost: 10.00,
      };

      const savedProduct = {
        productId: 1,
        name: "Café Americano",
        description: "Café negro americano clásico",
        price: 25.50,
        cost: 10.00,
        active: true,
        billDetails: [],
        ingredients: [],
      } as Product;

      mockRepository.save.mockResolvedValue(savedProduct);

      const result = await productService.save(productData);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: 1,
          name: "Café Americano",
          description: "Café negro americano clásico",
          price: 25.50,
          cost: 10.00,
        })
      );
      expect(result).toEqual(savedProduct);
    });

    it("debería crear una entidad Product con los datos correctos", async () => {
      const productData = {
        productId: 2,
        name: "Cappuccino",
        description: "Café con leche espumosa",
        price: 35.00,
        cost: 15.00,
      };

      let savedEntity: any;
      mockRepository.save.mockImplementation((product) => {
        savedEntity = product;
        return Promise.resolve({ ...product } as Product);
      });

      await productService.save(productData);

      expect(savedEntity).toBeInstanceOf(Product);
      expect(savedEntity.productId).toBe(2);
      expect(savedEntity.name).toBe("Cappuccino");
      expect(savedEntity.description).toBe("Café con leche espumosa");
      expect(savedEntity.price).toBe(35.00);
      expect(savedEntity.cost).toBe(15.00);
    });

    it("debería manejar diferentes tipos de productos", async () => {
      const productos = [
        {
          productId: 1,
          name: "Espresso",
          description: "Café concentrado",
          price: 20.00,
          cost: 8.00,
        },
        {
          productId: 2,
          name: "Latte",
          description: "Café con leche",
          price: 30.00,
          cost: 12.00,
        },
        {
          productId: 3,
          name: "Frappé",
          description: "Café frío con hielo",
          price: 45.00,
          cost: 18.00,
        },
        {
          productId: 4,
          name: "Mocha",
          description: "Café con chocolate",
          price: 40.00,
          cost: 16.00,
        },
      ];

      for (const producto of productos) {
        mockRepository.save.mockResolvedValue({} as Product);

        await productService.save(producto);

        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            productId: producto.productId,
            name: producto.name,
            description: producto.description,
            price: producto.price,
            cost: producto.cost,
          })
        );
      }
    });

    it("debería manejar precios y costos decimales precisos", async () => {
      const productData = {
        productId: 1,
        name: "Producto Decimal",
        description: "Prueba de decimales",
        price: 99.99,
        cost: 49.95,
      };

      mockRepository.save.mockResolvedValue({} as Product);

      await productService.save(productData);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          price: 99.99,
          cost: 49.95,
        })
      );
    });

    it("debería manejar nombres y descripciones con caracteres especiales", async () => {
      const productData = {
        productId: 1,
        name: "Café 100% Arábica",
        description: "Café premium & orgánico - Edición especial",
        price: 50.00,
        cost: 20.00,
      };

      mockRepository.save.mockResolvedValue({} as Product);

      await productService.save(productData);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Café 100% Arábica",
          description: "Café premium & orgánico - Edición especial",
        })
      );
    });

    it("debería manejar errores del repositorio", async () => {
      const productData = {
        productId: 1,
        name: "Test Error",
        description: "Test",
        price: 10.00,
        cost: 5.00,
      };

      const repositoryError = new Error("Error de base de datos");
      mockRepository.save.mockRejectedValue(repositoryError);

      await expect(productService.save(productData)).rejects.toThrow("Error de base de datos");
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it("debería manejar datos faltantes o indefinidos", async () => {
      const productDataIncompleto = {
        productId: undefined,
        name: "",
        description: undefined,
        price: 0,
        cost: undefined,
      };

      mockRepository.save.mockResolvedValue({} as Product);

      await productService.save(productDataIncompleto);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: undefined,
          name: "",
          description: undefined,
          price: 0,
          cost: undefined,
        })
      );
    });
  });

  describe("getById", () => {
    it("debería obtener un producto por ID", async () => {
      const productId = 1;
      const mockProduct = {
        productId: 1,
        name: "Café Americano",
        description: "Café negro",
        price: 25.00,
        cost: 10.00,
        active: true,
        billDetails: [],
        ingredients: [],
      } as Product;

      mockRepository.findOne.mockResolvedValue(mockProduct);

      const result = await productService.getById(productId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { productId: 1 },
      });
      expect(result).toEqual(mockProduct);
    });

    it("debería retornar null cuando el producto no existe", async () => {
      const productId = 999;
      mockRepository.findOne.mockResolvedValue(null);

      const result = await productService.getById(productId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { productId: 999 },
      });
      expect(result).toBeNull();
    });

    it("debería manejar errores del repositorio", async () => {
      const productId = 1;
      const repositoryError = new Error("Error de consulta");
      mockRepository.findOne.mockRejectedValue(repositoryError);

      await expect(productService.getById(productId)).rejects.toThrow("Error de consulta");
      expect(mockRepository.findOne).toHaveBeenCalled();
    });

    it("debería manejar diferentes IDs", async () => {
      const ids = [1, 10, 100, 999, 1000];

      for (const id of ids) {
        const mockProduct = {
          productId: id,
          name: `Producto ${id}`,
          description: `Descripción del producto ${id}`,
          price: id * 10,
          cost: id * 5,
          active: true,
          billDetails: [],
          ingredients: [],
        } as Product;

        mockRepository.findOne.mockResolvedValue(mockProduct);

        const result = await productService.getById(id);

        expect(result?.productId).toBe(id);
        expect(mockRepository.findOne).toHaveBeenCalledWith({
          where: { productId: id },
        });
      }
    });
  });

  describe("getAll", () => {
    it("debería obtener todos los productos", async () => {
      const mockProducts = [
        {
          productId: 1,
          name: "Espresso",
          description: "Café concentrado",
          price: 20.00,
          cost: 8.00,
          active: true,
          billDetails: [],
          ingredients: [],
        },
        {
          productId: 2,
          name: "Cappuccino",
          description: "Café con leche espumosa",
          price: 35.00,
          cost: 15.00,
          active: true,
          billDetails: [],
          ingredients: [],
        },
        {
          productId: 3,
          name: "Latte",
          description: "Café con leche",
          price: 30.00,
          cost: 12.00,
          active: false,
          billDetails: [],
          ingredients: [],
        },
      ] as Product[];

      mockRepository.find.mockResolvedValue(mockProducts);

      const result = await productService.getAll();

      expect(mockRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual(mockProducts);
      expect(result).toHaveLength(3);
    });

    it("debería retornar array vacío cuando no hay productos", async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await productService.getAll();

      expect(result).toEqual([]);
    });

    it("debería manejar errores del repositorio", async () => {
      const repositoryError = new Error("Error de conexión");
      mockRepository.find.mockRejectedValue(repositoryError);

      await expect(productService.getAll()).rejects.toThrow("Error de conexión");
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it("debería obtener productos con diferentes estados y precios", async () => {
      const mockProducts = [
        {
          productId: 1,
          name: "Producto Económico",
          description: "Opción económica",
          price: 10.00,
          cost: 3.00,
          active: true,
          billDetails: [],
          ingredients: [],
        },
        {
          productId: 2,
          name: "Producto Premium",
          description: "Opción premium",
          price: 100.00,
          cost: 40.00,
          active: true,
          billDetails: [],
          ingredients: [],
        },
        {
          productId: 3,
          name: "Producto Descontinuado",
          description: "Ya no disponible",
          price: 25.00,
          cost: 10.00,
          active: false,
          billDetails: [],
          ingredients: [],
        },
      ] as Product[];

      mockRepository.find.mockResolvedValue(mockProducts);

      const result = await productService.getAll();

      expect(result).toEqual(mockProducts);
      expect(result.some(p => p.active === true)).toBe(true);
      expect(result.some(p => p.active === false)).toBe(true);
      expect(result.some(p => p.price >= 100)).toBe(true);
      expect(result.some(p => p.price <= 10)).toBe(true);
    });
  });

  describe("delete", () => {
    it("debería eliminar un producto exitosamente", async () => {
      const productId = 1;
      const deleteResult = { affected: 1 };

      mockRepository.delete.mockResolvedValue(deleteResult as any);

      const result = await productService.delete(productId);

      expect(mockRepository.delete).toHaveBeenCalledWith(productId);
      expect(result).toEqual(deleteResult);
    });

    it("debería retornar resultado de eliminación cuando el producto no existe", async () => {
      const productId = 999;
      const deleteResult = { affected: 0 };

      mockRepository.delete.mockResolvedValue(deleteResult as any);

      const result = await productService.delete(productId);

      expect(mockRepository.delete).toHaveBeenCalledWith(productId);
      expect(result).toEqual(deleteResult);
    });

    it("debería manejar errores del repositorio", async () => {
      const productId = 1;
      const repositoryError = new Error("Error de eliminación");

      mockRepository.delete.mockRejectedValue(repositoryError);

      await expect(productService.delete(productId)).rejects.toThrow("Error de eliminación");
      expect(mockRepository.delete).toHaveBeenCalledWith(productId);
    });

    it("debería manejar diferentes IDs para eliminación", async () => {
      const ids = [1, 5, 10, 100, 999];

      for (const id of ids) {
        const deleteResult = { affected: 1 };
        mockRepository.delete.mockResolvedValue(deleteResult as any);

        const result = await productService.delete(id);

        expect(mockRepository.delete).toHaveBeenCalledWith(id);
        expect(result.affected).toBe(1);
      }
    });
  });


  describe("Casos de integración", () => {
    it("debería manejar flujo completo de CRUD básico", async () => {
      const productData = {
        productId: 1,
        name: "Producto Integración",
        description: "Producto para pruebas de integración",
        price: 45.00,
        cost: 20.00,
      };

      const savedProduct = {
        ...productData,
        active: true,
        billDetails: [],
        ingredients: [],
      } as Product;

      // 1. Guardar producto
      mockRepository.save.mockResolvedValue(savedProduct);
      const saveResult = await productService.save(productData);
      expect(saveResult).toEqual(savedProduct);

      // 2. Obtener por ID
      mockRepository.findOne.mockResolvedValue(savedProduct);
      const getResult = await productService.getById(1);
      expect(getResult).toEqual(savedProduct);

      // 3. Obtener todos los productos
      mockRepository.find.mockResolvedValue([savedProduct]);
      const getAllResult = await productService.getAll();
      expect(getAllResult).toContain(savedProduct);

      // 4. Eliminar producto
      const deleteResult = { affected: 1 };
      mockRepository.delete.mockResolvedValue(deleteResult as any);
      const deleteResponse = await productService.delete(1);
      expect(deleteResponse.affected).toBe(1);
    });

    it("debería manejar múltiples productos con diferentes características", async () => {
      const productos = [
        {
          productId: 1,
          name: "Café Básico",
          description: "Café estándar",
          price: 20.00,
          cost: 8.00,
        },
        {
          productId: 2,
          name: "Café Premium",
          description: "Café de alta calidad",
          price: 50.00,
          cost: 20.00,
        },
        {
          productId: 3,
          name: "Café Especialidad",
          description: "Café gourmet",
          price: 80.00,
          cost: 30.00,
        },
      ];

      const productosGuardados = productos.map(p => ({
        ...p,
        active: true,
        billDetails: [],
        ingredients: [],
      })) as Product[];

      // Guardar múltiples productos
      for (let i = 0; i < productos.length; i++) {
        mockRepository.save.mockResolvedValueOnce(productosGuardados[i]);
        
        const saveResult = await productService.save(productos[i]);
        expect(saveResult.productId).toBe(productos[i].productId);
        expect(saveResult.name).toBe(productos[i].name);
      }

      // Obtener todos los productos guardados
      mockRepository.find.mockResolvedValue(productosGuardados);
      const getAllResult = await productService.getAll();
      expect(getAllResult).toHaveLength(3);
      expect(getAllResult.map(p => p.name)).toEqual([
        "Café Básico",
        "Café Premium", 
        "Café Especialidad",
      ]);
    });

    it("debería manejar búsqueda individual de productos", async () => {
      const productosEjemplo = [
        { id: 1, nombre: "Americano", precio: 25.00 },
        { id: 2, nombre: "Cappuccino", precio: 35.00 },
        { id: 3, nombre: "Mocha", precio: 45.00 },
      ];

      for (const producto of productosEjemplo) {
        const mockProduct = {
          productId: producto.id,
          name: producto.nombre,
          description: `Delicioso ${producto.nombre}`,
          price: producto.precio,
          cost: producto.precio * 0.4,
          active: true,
          billDetails: [],
          ingredients: [],
        } as Product;

        mockRepository.findOne.mockResolvedValueOnce(mockProduct);

        const result = await productService.getById(producto.id);

        expect(result?.productId).toBe(producto.id);
        expect(result?.name).toBe(producto.nombre);
        expect(result?.price).toBe(producto.precio);
      }
    });
  });

  describe("Validaciones de datos", () => {
    it("debería manejar diferentes rangos de precios", async () => {
      const rangosPrecios = [
        { price: 0.01, cost: 0.01 }, // Mínimo
        { price: 10.00, cost: 5.00 }, // Bajo
        { price: 50.00, cost: 25.00 }, // Medio
        { price: 100.00, cost: 50.00 }, // Alto
        { price: 999.99, cost: 499.99 }, // Máximo
      ];

      for (const rango of rangosPrecios) {
        const productData = {
          productId: 1,
          name: `Producto ${rango.price}`,
          description: "Test de precios",
          price: rango.price,
          cost: rango.cost,
        };

        mockRepository.save.mockResolvedValue({} as Product);

        await productService.save(productData);

        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            price: rango.price,
            cost: rango.cost,
          })
        );
      }
    });

    it("debería manejar nombres de diferente longitud", async () => {
      const nombres = [
        "A", // Muy corto
        "Café",
        "Cappuccino Especial",
        "Café Moca con Chocolate Extra y Crema Batida Premium", // Muy largo
        "", // Vacío
      ];

      for (const nombre of nombres) {
        const productData = {
          productId: 1,
          name: nombre,
          description: "Test de nombres",
          price: 25.00,
          cost: 10.00,
        };

        mockRepository.save.mockResolvedValue({} as Product);

        await productService.save(productData);

        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            name: nombre,
          })
        );
      }
    });

    it("debería manejar descripciones especiales", async () => {
      const descripciones = [
        "", // Vacía
        "Descripción básica",
        "Café premium con notas de chocolate y caramelo, origen 100% colombiano",
        "Bebida fría • Ideal para verano • Sin azúcar • Vegano",
        "¡Nuevo! Café con 50% descuento",
        null, // Null
        undefined, // Undefined
      ];

      for (const descripcion of descripciones) {
        const productData = {
          productId: 1,
          name: "Test Producto",
          description: descripcion,
          price: 30.00,
          cost: 15.00,
        };

        mockRepository.save.mockResolvedValue({} as Product);

        await productService.save(productData);

        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            description: descripcion,
          })
        );
      }
    });

    it("debería manejar IDs extremos", async () => {
      const idsExtremos = [0, 1, 999, 1000, 9999, 99999];

      for (const id of idsExtremos) {
        const productData = {
          productId: id,
          name: `Producto ${id}`,
          description: "Test ID",
          price: 25.00,
          cost: 10.00,
        };

        mockRepository.save.mockResolvedValue({} as Product);

        await productService.save(productData);

        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            productId: id,
          })
        );
      }
    });

    it("debería manejar relaciones de costo-precio", async () => {
      const relacionesCostoPrecio = [
        { price: 100, cost: 50 }, // 50% margen
        { price: 100, cost: 80 }, // 20% margen
        { price: 100, cost: 10 }, // 90% margen
        { price: 100, cost: 100 }, // 0% margen
        { price: 100, cost: 120 }, // Costo mayor que precio
      ];

      for (const relacion of relacionesCostoPrecio) {
        const productData = {
          productId: 1,
          name: "Test Relación",
          description: "Test costo-precio",
          price: relacion.price,
          cost: relacion.cost,
        };

        mockRepository.save.mockResolvedValue({} as Product);

        await productService.save(productData);

        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            price: relacion.price,
            cost: relacion.cost,
          })
        );
      }
    });
  });
});