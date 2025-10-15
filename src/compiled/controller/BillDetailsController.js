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
exports.getDetails = exports.saveDetails = exports.setService = void 0;
let service;
const setService = (detailsService) => {
    service = detailsService;
};
exports.setService = setService;
const saveDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const result = yield service.saveAll(data);
        console.log("Factura y detalles guardados correctamente");
        return res.status(201).send({
            status: "success",
            message: "Factura y detalles guardados correctamente",
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
        console.log(error.message);
        return res.status(500).send({
            status: "error",
            message: "Hubo en error en el servidor al guardar el detalle",
            errors: error,
        });
    }
});
exports.saveDetails = saveDetails;
const getDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield service.getAll();
        console.log("Detalles obtenidos corretamente");
        return res.status(200).send({
            status: "success",
            message: "Detalles obtenidos corretamente",
            data: data,
        });
    }
    catch (error) {
        console.log(error);
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
            message: "Hubo un error en el servidor",
            errors: error.error,
        });
    }
});
exports.getDetails = getDetails;
