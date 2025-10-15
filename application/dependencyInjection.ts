//Entitys
import { Bill } from "../core/entities/Bill";
import { BillDetails } from "../core/entities/BillDetails";
import { Product } from "../core/entities/Producto";
import { User } from "../core/entities/User";
import { UserType } from "../core/entities/UserType";
import { Consumable } from "../core/entities/Consumable";
import { ConsumableType } from "../core/entities/ConsumableType";

//Utilitys
import { IService } from "../core/interfaces/IService";
import { getDataSource } from "../infrastructure/db/Connection";

//SetServices Methods
import { setService as setBillService } from "../controller/BillController";
import { setService as setProductService } from "../controller/ProductController";
import { setService as setBillDetailsService } from "../controller/BillDetailsController";
import { setService as setUserService } from "../controller/UserController";
import { setService as setUserTypeService } from "../controller/UserTypeController";
import { setService as setConsumableService } from "../controller/ConsumableController";
import { setService as setConsumableTypeService } from "../controller/ConsumableTypeController";

//Services
import { BillService } from "./services/BillService";
import { ProductService } from "./services/ProductService";
import { BillDetailsService } from "./services/BillDetailsService";
import { UserService } from "./services/UserService";
import { UserTypeService } from "./services/UserTypeService";
import { ConsumableService } from "./services/ConsumableService";
import { ConsumableTypeService } from "./services/ConsumableTypeService";

export const initializeDependencies = () => {
  const AppDataSource = getDataSource();
  AppDataSource.initialize();
  console.log(`Conexion exitosa a la base de datos`);

  //Repositories
  const billRepository = AppDataSource.getRepository(Bill);
  const productRepository = AppDataSource.getRepository(Product);
  const billDetailsRepository = AppDataSource.getRepository(BillDetails);
  const userRepositoy = AppDataSource.getRepository(User);
  const userTypeRepository = AppDataSource.getRepository(UserType);
  const consumableRepository = AppDataSource.getRepository(Consumable);
  const consumableTypeRepository = AppDataSource.getRepository(ConsumableType);

  //Services
  const billService: IService = new BillService(billRepository);
  const productService: IService = new ProductService(productRepository);
  const billDetailsService: IService = new BillDetailsService(
    billDetailsRepository,
    billService
  );
  const userService: IService = new UserService(userRepositoy);
  const userTypeService: IService = new UserTypeService(userTypeRepository);
  const consumableService: IService = new ConsumableService(
    consumableRepository
  );
  const consumableTypeService: IService = new ConsumableTypeService(
    consumableTypeRepository
  );

  setBillService(billService);
  setProductService(productService);
  setBillDetailsService(billDetailsService);
  setUserService(userService);
  setUserTypeService(userTypeService);
  setConsumableService(consumableService);
  setConsumableTypeService(consumableTypeService);
};

module.exports = { initializeDependencies };
