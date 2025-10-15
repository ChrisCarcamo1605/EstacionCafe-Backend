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
exports.getIngredients = exports.saveIngredient = exports.setService = void 0;
const IngredientValidations_1 = require("../application/validations/IngredientValidations");
let service;
const setService = (ingredientService) => {
    service = ingredientService;
};
exports.setService = setService;
const saveIngredient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const validatedData = IngredientValidations_1.IngredientSchema.parse(data);
        const result = yield service.save(validatedData);
        console.log("Ingrediente guardado correctamente");
        return res.status(201).send({
            status: "sucess",
            message: "Ingrediente guardado correctamente",
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
        console.error("Error al guardar el ingrediente:", error);
        return res.status(500).send({
            status: "error",
            message: `Error interno del servidor: ${error.message}`,
        });
    }
});
exports.saveIngredient = saveIngredient;
const getIngredients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield service.getAll();
        console.log("Ingredientes obtenidos correctamente");
        return res.status(200).send({
            status: "sucess",
            message: "Ingredientes obtenidos correctamente",
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
        console.error("Error al conseguir los ingredientes:", error);
        return res.status(500).send({
            status: "error",
            message: `Error interno del servidor: ${error.message}`,
        });
    }
});
exports.getIngredients = getIngredients;
