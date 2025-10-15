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
exports.deleteConsumableType = exports.updateConsumableType = exports.getConsumableTypes = exports.saveConsumableType = exports.setService = void 0;
const ConsumableValidations_1 = require("../application/validations/ConsumableValidations");
let service;
const setService = (consumableTypeService) => {
    service = consumableTypeService;
};
exports.setService = setService;
const saveConsumableType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const validatedData = ConsumableValidations_1.ConsumableTypeSchema.parse(data);
        const result = yield service.save(validatedData);
        return res.status(201).send({
            status: "sucess",
            message: "Tipo de consumible guardado correctamente",
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
        console.error("Error al guardar el tipo de consumible:", error);
        return res.status(500).send({
            status: "error",
            message: `Error interno del servidor: ${error.message}`,
        });
    }
});
exports.saveConsumableType = saveConsumableType;
const getConsumableTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield service.getAll();
        return res.status(200).send({
            status: "sucess",
            message: "Tipos de consumibles obtenidos correctamente",
            data: data,
        });
    }
    catch (error) {
        console.error("Error al obtener los tipos de consumibles:", error);
        return res.status(500).send({
            status: "error",
            message: `Error interno del servidor: ${error.message}`,
        });
    }
});
exports.getConsumableTypes = getConsumableTypes;
const updateConsumableType = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.updateConsumableType = updateConsumableType;
const deleteConsumableType = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.deleteConsumableType = deleteConsumableType;
