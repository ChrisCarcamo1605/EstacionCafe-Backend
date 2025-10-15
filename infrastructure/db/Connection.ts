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

export const getDataSource = () => {
  return new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5555,
    username: "admin",
    password: "estacionPass2025",
    database: "estacioncafedb",
    synchronize: true,
    logging: false,
    entities: [
      Bill,
      Product,
      BillDetails,
      User,
      UserType,
      Consumable,
      ConsumableType,
      Supplier,
      Purchase,
      Ingredient,
      historyLog,
      CashRegister,
    ],
    migrations: [],
    subscribers: [],
  });
};

module.exports = { getDataSource };
