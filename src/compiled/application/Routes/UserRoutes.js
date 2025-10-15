"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const UserController_1 = require("../../controller/UserController");
exports.userRoute = (0, express_1.Router)();
exports.userRoute.get("/users", UserController_1.getUsers);
exports.userRoute.post("/users", UserController_1.saveUser);
