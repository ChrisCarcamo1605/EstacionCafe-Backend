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
exports.getPurchasesByDateRange = exports.getPurchasesBySupplier = exports.deletePurchase = exports.updatePurchase = exports.createPurchase = exports.getPurchaseById = exports.getPurchases = exports.setService = void 0;
const PurchaseValidations_1 = require("../application/validations/PurchaseValidations");
let service = null;
const setService = (purchaseService) => {
    service = purchaseService;
};
exports.setService = setService;
const getService = () => {
    if (!service) {
        throw new Error("Purchase service no está inicializado. Llama a setService primero.");
    }
    return service;
};
const getPurchases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentService = getService();
        const data = yield currentService.getAll();
        return res.status(200).send({ body: data });
    }
    catch (error) {
        return res.status(500).send({
            status: "error",
            message: `Error al obtener las compras: ${error.message}`,
        });
    }
});
exports.getPurchases = getPurchases;
const getPurchaseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = PurchaseValidations_1.purchaseIdSchema.parse(req.params);
        const purchaseService = getService();
        const data = yield purchaseService.getById(id);
        return res.status(200).send({ body: data });
    }
    catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).send({
                status: "error",
                message: "ID inválido: " + error.issues[0].message,
            });
        }
        if (error.message.includes("no encontrada")) {
            return res.status(404).send({
                status: "error",
                message: error.message,
            });
        }
        return res.status(500).send({
            status: "error",
            message: `Error al obtener la compra: ${error.message}`,
        });
    }
});
exports.getPurchaseById = getPurchaseById;
const createPurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchaseData = req.body;
        const currentService = getService();
        const result = yield currentService.save(PurchaseValidations_1.createPurchaseSchema.parse(purchaseData));
        return res.status(201).send({
            message: "Compra creada correctamente",
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
        return res.status(500).send({
            status: "error",
            message: `Error interno del servidor: ${error.message}`,
        });
    }
});
exports.createPurchase = createPurchase;
const updatePurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = PurchaseValidations_1.purchaseIdSchema.parse(req.params);
        const updateData = PurchaseValidations_1.updatePurchaseSchema.parse(req.body);
        const purchaseService = getService();
        const result = yield purchaseService.update(Object.assign({ purchaseId: parseInt(String(id)) }, updateData));
        return res.status(200).send({
            message: "Compra actualizada correctamente",
            data: result,
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).send({
                status: "error",
                message: "Datos inválidos: " + error.issues[0].message,
                campo: error.issues[0].path,
            });
        }
        if (error.message.includes("no encontrada")) {
            return res.status(404).send({
                status: "error",
                message: error.message,
            });
        }
        return res.status(500).send({
            status: "error",
            message: `Error interno del servidor: ${error.message}`,
        });
    }
});
exports.updatePurchase = updatePurchase;
const deletePurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = PurchaseValidations_1.purchaseIdSchema.parse(req.params);
        const currentService = getService();
        const result = yield currentService.delete(parseInt(String(id)));
        return res.status(200).send({
            message: "Compra eliminada correctamente",
            data: result,
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).send({
                status: "error",
                message: "ID inválido: " + error.issues[0].message,
            });
        }
        if (error.message.includes("no encontrada")) {
            return res.status(404).send({
                status: "error",
                message: error.message,
            });
        }
        return res.status(500).send({
            status: "error",
            message: `Error interno del servidor: ${error.message}`,
        });
    }
});
exports.deletePurchase = deletePurchase;
const getPurchasesBySupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supplierId } = req.params;
        const purchaseService = getService();
        const data = yield purchaseService.getBySupplier(parseInt(supplierId));
        return res.status(200).send({ body: data });
    }
    catch (error) {
        return res.status(500).send({
            status: "error",
            message: `Error al obtener las compras del proveedor: ${error.message}`,
        });
    }
});
exports.getPurchasesBySupplier = getPurchasesBySupplier;
const getPurchasesByDateRange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        const purchaseService = getService();
        if (!startDate || !endDate) {
            return res.status(400).send({
                status: "error",
                message: "startDate y endDate son requeridos"
            });
        }
        const data = yield purchaseService.getByDateRange(new Date(startDate), new Date(endDate));
        return res.status(200).send({ body: data });
    }
    catch (error) {
        return res.status(500).send({
            status: "error",
            message: `Error al obtener las compras por rango de fecha: ${error.message}`,
        });
    }
});
exports.getPurchasesByDateRange = getPurchasesByDateRange;
