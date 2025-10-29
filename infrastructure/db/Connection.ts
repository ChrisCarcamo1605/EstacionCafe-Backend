import { DataSource } from "typeorm";
import { Bill } from "../../core/entities/Bill";
import { Product } from "../../core/entities/Producto";
import { BillDetails } from "../../core/entities/BillDetails";
import { User } from "../../core/entities/User";
import { UserType } from "../../core/entities/UserType";
import { Consumable } from "../../core/entities/Consumable";
import { ConsumableType } from "../../core/entities/ConsumableType";
import { Supplier } from "../../core/entities/Supplier";
import { Purchase } from "../../core/entities/Purchase";
import { Ingredient } from "../../core/entities/Ingredient";
import { historyLog } from "../../core/entities/HistoryLog";
import { CashRegister } from "../../core/entities/CashRegister";
import { join } from "path";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5555,
  username: "admin",
  password: "estacionPass2025",
  database: "estacioncafedb",
  synchronize: true,
  logging: false,
  entities: [join(__dirname,'../../core/entities/*{.ts,.js}')
  ],
  migrations: [join(__dirname,'./migrations/*{.ts,.js}')],
  subscribers: [],
});

export const getDataSource = () => {
  return AppDataSource;
};

export default AppDataSource;

module.exports = { getDataSource, AppDataSource };


