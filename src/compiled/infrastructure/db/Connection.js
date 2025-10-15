"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataSource = void 0;
const typeorm_1 = require("typeorm");
const Bill_1 = require("../../domain/entities/Bill");
const Producto_1 = require("../../domain/entities/Producto");
const BillDetails_1 = require("../../domain/entities/BillDetails");
const User_1 = require("../../domain/entities/User");
const UserType_1 = require("../../domain/entities/UserType");
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
        entities: [Bill_1.Bill, Producto_1.Product, BillDetails_1.BillDetails, User_1.User, UserType_1.UserType],
        migrations: [],
        subscribers: [],
    });
};
exports.getDataSource = getDataSource;
module.exports = { getDataSource: exports.getDataSource };
