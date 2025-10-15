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
exports.saveBill = exports.getBills = exports.setService = void 0;
const BillValidations_1 = require("../application/validations/BillValidations");
let service;
const setService = (billService) => {
    service = billService;
};
exports.setService = setService;
const getBills = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield service.getAll();
        console.log("Facturas obtenidas correctamente");
        return res.status(200).send({ body: data });
    }
    catch (error) {
        return res.status(500).send({
            status: "error",
            message: `Error al conseguir las facturas ${error}`,
        });
    }
});
exports.getBills = getBills;
const saveBill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const billData = req.body;
        const result = yield service.save(BillValidations_1.billSchema.parse(billData));
        console.log("Factura creada correctamente");
        return res.status(201).send({
            message: "Factura creada correctamente",
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
        console.error("Error al guardar factura:", error);
        return res.status(500).send({
            status: "error",
            message: `Error interno del servidor: ${error.message}`,
        });
    }
});
exports.saveBill = saveBill;
// Las funciones ya están exportadas individualmente arriba
