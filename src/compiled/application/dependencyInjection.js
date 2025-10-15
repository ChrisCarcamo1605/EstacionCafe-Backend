"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDependencies = void 0;
//Entitys
const Bill_1 = require("../core/entities/Bill");
const BillDetails_1 = require("../core/entities/BillDetails");
const Producto_1 = require("../core/entities/Producto");
const User_1 = require("../core/entities/User");
const UserType_1 = require("../core/entities/UserType");
const Consumable_1 = require("../core/entities/Consumable");
const ConsumableType_1 = require("../core/entities/ConsumableType");
const Connection_1 = require("../infrastructure/db/Connection");
//SetServices Methods
const BillController_1 = require("../controller/BillController");
const ProductController_1 = require("../controller/ProductController");
const BillDetailsController_1 = require("../controller/BillDetailsController");
const UserController_1 = require("../controller/UserController");
const UserTypeController_1 = require("../controller/UserTypeController");
const ConsumableController_1 = require("../controller/ConsumableController");
const ConsumableTypeController_1 = require("../controller/ConsumableTypeController");
//Services
const BillService_1 = require("./services/BillService");
const ProductService_1 = require("./services/ProductService");
const BillDetailsService_1 = require("./services/BillDetailsService");
const UserService_1 = require("./services/UserService");
const UserTypeService_1 = require("./services/UserTypeService");
const ConsumableService_1 = require("./services/ConsumableService");
const ConsumableTypeService_1 = require("./services/ConsumableTypeService");
const initializeDependencies = () => {
    const AppDataSource = (0, Connection_1.getDataSource)();
    AppDataSource.initialize();
    console.log(`Conexion exitosa a la base de datos`);
    //Repositories
    const billRepository = AppDataSource.getRepository(Bill_1.Bill);
    const productRepository = AppDataSource.getRepository(Producto_1.Product);
    const billDetailsRepository = AppDataSource.getRepository(BillDetails_1.BillDetails);
    const userRepositoy = AppDataSource.getRepository(User_1.User);
    const userTypeRepository = AppDataSource.getRepository(UserType_1.UserType);
    const consumableRepository = AppDataSource.getRepository(Consumable_1.Consumable);
    const consumableTypeRepository = AppDataSource.getRepository(ConsumableType_1.ConsumableType);
    //Services
    const billService = new BillService_1.BillService(billRepository);
    const productService = new ProductService_1.ProductService(productRepository);
    const billDetailsService = new BillDetailsService_1.BillDetailsService(billDetailsRepository, billService);
    const userService = new UserService_1.UserService(userRepositoy);
    const userTypeService = new UserTypeService_1.UserTypeService(userTypeRepository);
    const consumableService = new ConsumableService_1.ConsumableService(consumableRepository);
    const consumableTypeService = new ConsumableTypeService_1.ConsumableTypeService(consumableTypeRepository);
    (0, BillController_1.setService)(billService);
    (0, ProductController_1.setService)(productService);
    (0, BillDetailsController_1.setService)(billDetailsService);
    (0, UserController_1.setService)(userService);
    (0, UserTypeController_1.setService)(userTypeService);
    (0, ConsumableController_1.setService)(consumableService);
    (0, ConsumableTypeController_1.setService)(consumableTypeService);
};
exports.initializeDependencies = initializeDependencies;
module.exports = { initializeDependencies: exports.initializeDependencies };
