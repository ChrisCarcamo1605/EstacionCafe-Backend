//Utilitys
import { IService } from "./interfaces/IService";
import { ITokenService } from "./interfaces/ITokenService";
import { IUserService } from "./interfaces/IUserService";
import { getDataSource } from "../infrastructure/db/Connection";

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
import { CashRegisterService } from "../application/services/CashRegisterService";
import { TokenService } from "../infrastructure/security/TokenService";

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
import { CashRegister } from "./entities/CashRegister";

export const initializeDependencies = async () => {
  const AppDataSource = getDataSource();

  try {
    await AppDataSource.initialize();
    console.log("Conexión exitosa a la base de datos");

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
    const cashRegisterRepository = AppDataSource.getRepository(CashRegister);

    //Services
    const billService: IService = new BillService(billRepository);
    const productService: IService = new ProductService(productRepository);
    const billDetailsService: IService = new BillDetailsService(
      billDetailsRepository,
      billService
    );
    const userService: IUserService = new UserService(userRepositoy);
    const userTypeService: IService = new UserTypeService(userTypeRepository);
    const consumableService: IService = new ConsumableService(
      consumableRepository
    );
    const consumableTypeService: IService = new ConsumableTypeService(
      consumableTypeRepository
    );
    const supplierService: IService = new SupplierService(supplierRepository);
    const purchaseService: IService = new PurchaseService(purchaseRepository);
    const ingredientService: IService = new IngredientService(
      ingredientRepository
    );
    const cashRegisterService: IService = new CashRegisterService(
      cashRegisterRepository
    );
    const tokenService: ITokenService = new TokenService(userService);
    
    //Set Services to Controllers
    setBillService(billService);
    setProductService(productService);
    setBillDetailsService(billDetailsService);
    setUserServices(userService,tokenService);
    setUserTypeService(userTypeService);
    setConsumableService(consumableService);
    setConsumableTypeService(consumableTypeService);
    setIngredientService(ingredientService);
    setSupplierService(supplierService);
    setPurchaseService(purchaseService);
    setCashRegisterService(cashRegisterService);

    console.log("Dependencias inicializadas correctamente");
  } catch (error: any) {

    console.error("Error al inicializar la base de datos:", error.message);
    console.error("Detalles del error:", error);

    throw new error;
  }
};

module.exports = { initializeDependencies };
