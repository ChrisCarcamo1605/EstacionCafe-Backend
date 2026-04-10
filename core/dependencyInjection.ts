//Utilitys
import { IService } from "./interfaces/IService";
import { ITokenService } from "./interfaces/ITokenService";
import { IUserService } from "./interfaces/IUserService";
import { getDataSource, runMigrations } from "../infrastructure/db/Connection";
import { DatabaseSeeder } from "../infrastructure/db/seeders/DatabaseSeeder";

//SetServices Methods
import { setService as setBillService } from "../controller/BillController";
import { setService as setProductService } from "../controller/ProductController";
import { setService as setBillDetailsService } from "../controller/BillDetailsController";
import { setServices as setUserServices } from "../controller/UserController";
import { setService as setUserTypeService } from "../controller/UserTypeController";
import { setService as setConsumableService } from "../controller/ConsumableController";
import { setService as setConsumableTypeService } from "../controller/ConsumableTypeController";
import { setService as setIngredientService } from "../controller/IngredientController";
import { setService as setSupplierService } from "../controller/SupplierController";
import { setService as setPurchaseService } from "../controller/PurchaseController";
import { setService as setCashRegisterService } from "../controller/CashRegisterController";
import { setService as setTableService } from "../controller/TableController";
import { setService as setProductTypeService } from "../controller/ProductTypeController";

//Initialize Middleware
import { initializeAuthMiddleware } from "../infrastructure/security/authMiddleware";

//Services
import { BillService } from "../application/services/BillService";
import { ProductService } from "../application/services/ProductService";
import { BillDetailsService } from "../application/services/BillDetailsService";
import { UserService } from "../application/services/UserService";
import { UserTypeService } from "../application/services/UserTypeService";
import { ConsumableService } from "../application/services/ConsumableService";
import { ConsumableTypeService } from "../application/services/ConsumableTypeService";
import { SupplierService } from "../application/services/SupplierService";
import { IngredientService } from "../application/services/IngredientService";
import { PurchaseService } from "../application/services/PurchaseService";
import { TokenService } from "../infrastructure/security/TokenService";
import { TableService } from "../application/services/TableService";
import { ProductTypeService } from "../application/services/ProductTypeService";

//Entitys
import { Bill } from "./entities/Bill";
import { BillDetails } from "./entities/BillDetails";
import { Product } from "./entities/Producto";
import { User } from "./entities/User";
import { UserType } from "./entities/UserType";
import { Consumable } from "./entities/Consumable";
import { ConsumableType } from "./entities/ConsumableType";
import { Ingredient } from "./entities/Ingredient";
import { Supplier } from "./entities/Supplier";
import { Purchase } from "./entities/Purchase";
import { Table } from "./entities/Table";
import { ProductType } from "./entities/ProductType";
import { DataSource } from "typeorm";

/**
 * Check if the database is empty by counting records in key tables.
 * Returns true if at least one of the lookup tables has no records.
 */
const shouldRunSeeds = async (ds: DataSource): Promise<boolean> => {
  try {
    const productTypeCount = await ds.getRepository(ProductType).count();
    const userTypeCount = await ds.getRepository(UserType).count();
    const supplierCount = await ds.getRepository(Supplier).count();
    const tableCount = await ds.getRepository(Table).count();

    const isEmpty =
      productTypeCount === 0 ||
      userTypeCount === 0 ||
      supplierCount === 0 ||
      tableCount === 0;

    if (isEmpty) {
      console.log(
        `DB vacía: product_types=${productTypeCount}, user_types=${userTypeCount}, suppliers=${supplierCount}, tables=${tableCount}`,
      );
    }
    return isEmpty;
  } catch {
    return true;
  }
};

export const initializeDependencies = async () => {
  const AppDataSource = getDataSource();

  try {
    await AppDataSource.initialize();
    console.log("Conexión exitosa a la base de datos");

    // Run pending migrations
    await runMigrations();

    // Run seeds if database is empty (only independent entities need to be checked)
    const shouldSeed = await shouldRunSeeds(AppDataSource);
    if (shouldSeed) {
      console.log("🌱 Base de datos vacía, ejecutando seeds...");
      const seeder = new DatabaseSeeder(AppDataSource);
      await seeder.runAll();
      console.log("✅ Base de datos poblada correctamente");
    }

    //Repositories
    const billRepository = AppDataSource.getRepository(Bill);
    const productRepository = AppDataSource.getRepository(Product);
    const billDetailsRepository = AppDataSource.getRepository(BillDetails);
    const userRepositoy = AppDataSource.getRepository(User);
    const userTypeRepository = AppDataSource.getRepository(UserType);
    const consumableRepository = AppDataSource.getRepository(Consumable);
    const consumableTypeRepository =
      AppDataSource.getRepository(ConsumableType);
    const supplierRepository = AppDataSource.getRepository(Supplier);
    const ingredientRepository = AppDataSource.getRepository(Ingredient);
    const purchaseRepository = AppDataSource.getRepository(Purchase);
    const tableRepository = AppDataSource.getRepository(Table);
    const productTypeRepository = AppDataSource.getRepository(ProductType);

    //Services
    const billService: IService = new BillService(billRepository);
    const productService: IService = new ProductService(productRepository);
    const billDetailsService: IService = new BillDetailsService(
      billDetailsRepository,
      billService,
    );
    const userService: IUserService = new UserService(userRepositoy);
    const userTypeService: IService = new UserTypeService(userTypeRepository);
    const consumableService: IService = new ConsumableService(
      consumableRepository,
    );
    const consumableTypeService: IService = new ConsumableTypeService(
      consumableTypeRepository,
    );
    const supplierService: IService = new SupplierService(supplierRepository);
    const purchaseService: IService = new PurchaseService(purchaseRepository);
    const ingredientService: IService = new IngredientService(
      ingredientRepository,
    );
    const tokenService: ITokenService = new TokenService(userService);
    const tableService: IService = new TableService(tableRepository);
    const productTypeService: IService = new ProductTypeService(
      productTypeRepository,
    );

    //Set Services to Controllers
    setBillService(billService);
    setProductService(productService);
    setBillDetailsService(billDetailsService);
    setUserServices(userService, tokenService);
    setUserTypeService(userTypeService);
    setConsumableService(consumableService);
    setConsumableTypeService(consumableTypeService);
    setIngredientService(ingredientService);
    setSupplierService(supplierService);
    setPurchaseService(purchaseService);
    setTableService(tableService);
    setProductTypeService(productTypeService);

    // Inicializar middleware con el servicio de tokens
    initializeAuthMiddleware(tokenService);

    console.log("Dependencias inicializadas correctamente");
  } catch (error: any) {
    console.error("Error al inicializar la base de datos:", error.message);
    console.error("Detalles del error:", error);

    throw error;
  }
};

module.exports = { initializeDependencies };
