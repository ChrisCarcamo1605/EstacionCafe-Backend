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
exports.getProducts = exports.saveProduct = exports.setService = void 0;
const ProductValidations_1 = require("../application/validations/ProductValidations");
let service;
const setService = (productService) => {
    service = productService;
};
exports.setService = setService;
const saveProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const validatedData = ProductValidations_1.productSchema.parse(data);
        const result = yield service.save(validatedData);
        console.log("Producto guardado correctamente");
        return res.status(201).send({
            status: "success",
            message: "El producto se guardo correctamente",
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
            message: "Hubo en error en el servidor al guardar el producto",
            errors: error,
        });
    }
});
exports.saveProduct = saveProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield service.getAll();
        console.log("Productos obtenidos correctamente");
        const productDTOs = products.map((product) => ({
            productId: product.productId,
            name: product.name,
            description: product.description,
            price: product.price,
            cost: product.cost,
        }));
        return res.status(200).send({
            status: "success",
            data: productDTOs,
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
            message: "Error al obtener los productos",
            errors: error.issues || error.errors,
        });
    }
});
exports.getProducts = getProducts;
