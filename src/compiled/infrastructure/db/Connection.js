"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataSource = void 0;
const typeorm_1 = require("typeorm");
const Bill_1 = require("../../core/entities/Bill");
const Producto_1 = require("../../core/entities/Producto");
const BillDetails_1 = require("../../core/entities/BillDetails");
const User_1 = require("../../core/entities/User");
const UserType_1 = require("../../core/entities/UserType");
const Consumable_1 = require("../../core/entities/Consumable");
const ConsumableType_1 = require("../../core/entities/ConsumableType");
const Supplier_1 = require("../../core/entities/Supplier");
const Purchase_1 = require("../../core/entities/Purchase");
const Ingredient_1 = require("../../core/entities/Ingredient");
const HistoryLog_1 = require("../../core/entities/HistoryLog");
const CashRegister_1 = require("../../core/entities/CashRegister");
const getDataSource = () => {
    return new typeorm_1.DataSource({
        type: "postgres",
        host: "localhost",
        port: 5555,
        username: "admin",
        password: "estacionPass2025",
        database: "estacioncafedb",
        synchronize: true,
        logging: false,
        entities: [
            Bill_1.Bill,
            Producto_1.Product,
            BillDetails_1.BillDetails,
            User_1.User,
            UserType_1.UserType,
            Consumable_1.Consumable,
            ConsumableType_1.ConsumableType,
            Supplier_1.Supplier,
            Purchase_1.Purchase,
            Ingredient_1.Ingredient,
            HistoryLog_1.historyLog,
            CashRegister_1.CashRegister,
        ],
        migrations: [],
        subscribers: [],
    });
};
exports.getDataSource = getDataSource;
module.exports = { getDataSource: exports.getDataSource };
