//Entitys
import { Bill } from "../domain/entities/Bill";
import { BillDetails } from "../domain/entities/BillDetails";
import { Product } from "../domain/entities/Producto";
import { User } from "../domain/entities/User";
import { UserType } from "../domain/entities/UserType";

//Utilitys
import { IService } from "../domain/interfaces/IService";
import { getDataSource } from "../infrastructure/db/Connection";

//SetServices Methods
import { setService as setBillService } from "../controller/BillController";
import { setService as setProductService } from "../controller/ProductController";
import { setService as setBillDetailsService } from "../controller/BillDetailsController";
import { setService as setUserService } from "../controller/UserController";
import { setService as setUserTypeService } from "../controller/UserTypeController";
//Services
import { BillService } from "./services/BillService";
import { ProductService } from "./services/ProductService";
import { BillDetailsService } from "./services/BillDetailsService";
import { UserService } from "./services/UserService";
import { UserTypeService } from "./services/UserTypeService";

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

  //Services
  const billService: IService = new BillService(billRepository);
  const productService: IService = new ProductService(productRepository);
  const billDetailsService: IService = new BillDetailsService(
    billDetailsRepository,
    billService
  );
  const userService: IService = new UserService(userRepositoy);
  const userTypeService: IService = new UserTypeService(userTypeRepository);

  setBillService(billService);
  setProductService(productService);
  setBillDetailsService(billDetailsService);
  setUserService(userService);
  setUserTypeService(userTypeService);
};

module.exports = { initializeDependencies };
