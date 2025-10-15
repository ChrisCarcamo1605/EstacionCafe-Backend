"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.saveUser = exports.setService = void 0;
const UserValidations_1 = require("../application/validations/UserValidations");
let service;
const setService = (userService) => {
    service = userService;
};
exports.setService = setService;
const saveUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const dataValidated = UserValidations_1.userSchema.parse(data);
        const result = yield service.save(dataValidated);
        console.log("Usuario guardado correctamente");
        return res.status(201).send({
            status: "sucess",
            message: "El usuario fue registrado correctamente",
            data: result,
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).send({
                status: "error",
                message: "Datos inválidos: " + error.issues[0].message,
                campo: error.issues[0].path,
                error: error.issues[0].code,
            });
        }
        console.log(error);
        res.status(500).send({
            status: "error",
            message: "Hubo un error: " + error.message,
            errors: error.errors || error.issues,
        });
    }
});
exports.saveUser = saveUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield service.getAll();
        console.log("Usuarios obtenidos correctamente");
        return res.status(200).send({
            status: "sucess",
            message: "Usuarios obtenidos correctamente",
            data: data,
        });
    }
    catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Hubo un error al obtener los datos:\n" + error.message,
        });
    }
});
exports.getUsers = getUsers;
