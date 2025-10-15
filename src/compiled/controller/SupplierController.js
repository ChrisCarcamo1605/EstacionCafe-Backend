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
exports.getActiveSuppliers = exports.deleteSupplier = exports.updateSupplier = exports.createSupplier = exports.getSupplierById = exports.getSuppliers = exports.setService = void 0;
const SupplierValidations_1 = require("../application/validations/SupplierValidations");
let service;
const setService = (supplierService) => {
    service = supplierService;
};
exports.setService = setService;
const getSuppliers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield service.getAll();
        console.log("Proveedores obtenidos correctamente");
        return res.status(200).send({ body: data });
    }
    catch (error) {
        return res.status(500).send({
            status: "error",
            message: `Error al obtener los proveedores: ${error}`,
        });
    }
});
exports.getSuppliers = getSuppliers;
const getSupplierById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = SupplierValidations_1.supplierIdSchema.parse(req.params);
        const supplierService = service;
        const data = yield supplierService.getById(id);
        console.log("Proveedor obtenido correctamente");
        return res.status(200).send({ body: data });
    }
    catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).send({
                status: "error",
                message: "ID inválido: " + error.issues[0].message,
            });
        }
        if (error.message.includes("no encontrado")) {
            return res.status(404).send({
                status: "error",
                message: error.message,
            });
        }
        return res.status(500).send({
            status: "error",
            message: `Error al obtener el proveedor: ${error.message}`,
        });
    }
});
exports.getSupplierById = getSupplierById;
const createSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplierData = req.body;
        const result = yield service.save(SupplierValidations_1.createSupplierSchema.parse(supplierData));
        console.log("Proveedor creado correctamente");
        return res.status(201).send({
            message: "Proveedor creado correctamente",
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
        console.error("Error al crear proveedor:", error);
        return res.status(500).send({
            status: "error",
            message: `Error interno del servidor: ${error.message}`,
        });
    }
});
exports.createSupplier = createSupplier;
const updateSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = SupplierValidations_1.supplierIdSchema.parse(req.params);
        const updateData = SupplierValidations_1.updateSupplierSchema.parse(req.body);
        const supplierService = service;
        const result = yield supplierService.update(Object.assign({ supplierId: id }, updateData));
        console.log("Proveedor actualizado correctamente");
        return res.status(200).send({
            message: "Proveedor actualizado correctamente",
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
        if (error.message.includes("no encontrado")) {
            return res.status(404).send({
                status: "error",
                message: error.message,
            });
        }
        console.error("Error al actualizar proveedor:", error);
        return res.status(500).send({
            status: "error",
            message: `Error interno del servidor: ${error.message}`,
        });
    }
});
exports.updateSupplier = updateSupplier;
const deleteSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = SupplierValidations_1.supplierIdSchema.parse(req.params);
        const result = yield service.delete(id);
        console.log("Proveedor eliminado correctamente");
        return res.status(200).send({
            message: "Proveedor eliminado correctamente",
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
        if (error.message.includes("no encontrado")) {
            return res.status(404).send({
                status: "error",
                message: error.message,
            });
        }
        console.error("Error al eliminar proveedor:", error);
        return res.status(500).send({
            status: "error",
            message: `Error interno del servidor: ${error.message}`,
        });
    }
});
exports.deleteSupplier = deleteSupplier;
const getActiveSuppliers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplierService = service;
        const data = yield supplierService.getActiveSuppliers();
        console.log("Proveedores activos obtenidos correctamente");
        return res.status(200).send({ body: data });
    }
    catch (error) {
        return res.status(500).send({
            status: "error",
            message: `Error al obtener los proveedores activos: ${error}`,
        });
    }
});
exports.getActiveSuppliers = getActiveSuppliers;
