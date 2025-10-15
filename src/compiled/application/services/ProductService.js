"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const Producto_1 = require("../../core/entities/Producto");
class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
        this.productRepository = productRepository;
    }
    saveAll(body) {
        throw new Error("Method not implemented.");
    }
    save(body) {
        const data = body;
        const prod = new Producto_1.Product();
        prod.productId = data.productId;
        prod.name = data.name;
        prod.description = data.description;
        prod.price = data.price;
        prod.cost = data.cost;
        console.log("Guardando producto...");
        return this.productRepository.save(prod);
    }
    delete(id) {
        return this.productRepository.delete(id);
    }
    update(body) {
        throw new Error("Method not implemented.");
    }
    getAll() {
        console.log(`Obteniendo productos...`);
        return this.productRepository.find();
    }
}
exports.ProductService = ProductService;
