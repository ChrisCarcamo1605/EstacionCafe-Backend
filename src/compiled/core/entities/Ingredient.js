"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ingredient = void 0;
class Ingredient {
    constructor(ingredientId, consumibleId, name, quantity, productId) {
        this.consumibleId = consumibleId;
        this.productId = productId;
        this.name = name;
        this.ingredientId = ingredientId;
        this.quantity = quantity;
    }
}
exports.Ingredient = Ingredient;
