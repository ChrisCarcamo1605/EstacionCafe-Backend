"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientService = void 0;
const Ingredient_1 = require("../../core/entities/Ingredient");
class IngredientService {
    constructor(ingredientRepo) {
        this.ingredientRepo = ingredientRepo;
        this.ingredientRepo = ingredientRepo;
    }
    save(body) {
        const ingredient = new Ingredient_1.Ingredient();
        ingredient.name = body.name;
        ingredient.quantity = body.quantity;
        ingredient.productId = body.productId;
        ingredient.consumableId = body.consumableId;
        console.log("Guardando ingrediente...");
        return this.ingredientRepo.save(ingredient);
    }
    saveAll(body) {
        throw new Error("Method not implemented.");
    }
    delete(id) {
        throw new Error("Method not implemented.");
    }
    update(body) {
        throw new Error("Method not implemented.");
    }
    getAll() {
        console.log("Obteniendo ingredientes...");
        return this.ingredientRepo.find({ relations: ["product", "consumable"] });
    }
}
exports.IngredientService = IngredientService;
