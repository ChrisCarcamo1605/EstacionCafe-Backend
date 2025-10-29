import { DataSource } from "typeorm";
import { BaseSeeder } from "./BaseSeeder";
import { Ingredient } from "../../../core/entities/Ingredient";

export class IngredientSeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const ingredientRepo = this.dataSource.getRepository(Ingredient);
    
    const ingredients = [
      // Espresso Solo (Producto ID: 1)
      { consumableId: 1, name: "Café Arábica Premium", quantity: 18.0, productId: 1 }, // 18g café
      
      // Espresso Doble (Producto ID: 2)
      { consumableId: 1, name: "Café Arábica Premium", quantity: 36.0, productId: 2 }, // 36g café
      
      // Espresso Romano (Producto ID: 3)
      { consumableId: 1, name: "Café Arábica Premium", quantity: 18.0, productId: 3 }, // 18g café
      
      // Cappuccino Clásico (Producto ID: 4)
      { consumableId: 4, name: "Espresso Blend", quantity: 18.0, productId: 4 }, // 18g café
      { consumableId: 6, name: "Leche Entera", quantity: 150.0, productId: 4 }, // 150ml leche
      
      // Latte Tradicional (Producto ID: 5)
      { consumableId: 4, name: "Espresso Blend", quantity: 18.0, productId: 5 }, // 18g café
      { consumableId: 6, name: "Leche Entera", quantity: 180.0, productId: 5 }, // 180ml leche
      
      // Flat White (Producto ID: 6)
      { consumableId: 4, name: "Espresso Blend", quantity: 36.0, productId: 6 }, // 36g café (doble)
      { consumableId: 6, name: "Leche Entera", quantity: 160.0, productId: 6 }, // 160ml leche
      
      // Macchiato (Producto ID: 7)
      { consumableId: 4, name: "Espresso Blend", quantity: 18.0, productId: 7 }, // 18g café
      { consumableId: 6, name: "Leche Entera", quantity: 30.0, productId: 7 }, // 30ml leche
      
      // Mocha Premium (Producto ID: 8)
      { consumableId: 4, name: "Espresso Blend", quantity: 18.0, productId: 8 }, // 18g café
      { consumableId: 6, name: "Leche Entera", quantity: 150.0, productId: 8 }, // 150ml leche
      { consumableId: 10, name: "Chocolate Premium", quantity: 25.0, productId: 8 }, // 25g chocolate
      
      // Caramel Macchiato (Producto ID: 9)
      { consumableId: 4, name: "Espresso Blend", quantity: 18.0, productId: 9 }, // 18g café
      { consumableId: 6, name: "Leche Entera", quantity: 180.0, productId: 9 }, // 180ml leche
      { consumableId: 23, name: "Sirope de Caramelo", quantity: 20.0, productId: 9 }, // 20ml sirope
      
      // Americano (Producto ID: 10)
      { consumableId: 4, name: "Espresso Blend", quantity: 18.0, productId: 10 }, // 18g café
      
      // Iced Latte (Producto ID: 11)
      { consumableId: 4, name: "Espresso Blend", quantity: 18.0, productId: 11 }, // 18g café
      { consumableId: 6, name: "Leche Entera", quantity: 180.0, productId: 11 }, // 180ml leche
      
      // Cold Brew (Producto ID: 12)
      { consumableId: 2, name: "Café Robusta", quantity: 80.0, productId: 12 }, // 80g café para cold brew
      
      // Frappé Mocha (Producto ID: 13)
      { consumableId: 4, name: "Espresso Blend", quantity: 18.0, productId: 13 }, // 18g café
      { consumableId: 6, name: "Leche Entera", quantity: 150.0, productId: 13 }, // 150ml leche
      { consumableId: 10, name: "Chocolate Premium", quantity: 30.0, productId: 13 }, // 30g chocolate
      
      // Té Matcha Latte (Producto ID: 14)
      { consumableId: 12, name: "Té Verde Matcha", quantity: 4.0, productId: 14 }, // 4g matcha
      { consumableId: 6, name: "Leche Entera", quantity: 180.0, productId: 14 }, // 180ml leche
      
      // Chai Latte (Producto ID: 15)
      { consumableId: 13, name: "Té Negro Earl Grey", quantity: 5.0, productId: 15 }, // 5g té
      { consumableId: 6, name: "Leche Entera", quantity: 180.0, productId: 15 }, // 180ml leche
      { consumableId: 21, name: "Canela en Polvo", quantity: 2.0, productId: 15 }, // 2g canela
      
      // Chocolate Caliente Premium (Producto ID: 16)
      { consumableId: 10, name: "Chocolate Premium", quantity: 40.0, productId: 16 }, // 40g chocolate
      { consumableId: 6, name: "Leche Entera", quantity: 200.0, productId: 16 }, // 200ml leche
    ];

    for (const ingredient of ingredients) {
      const exists = await ingredientRepo.findOne({ 
        where: { 
          consumableId: ingredient.consumableId,
          productId: ingredient.productId 
        } 
      });
      
      if (!exists) {
        await ingredientRepo.save(ingredient);
        console.log(`---SUCESS--- Ingredient created: ${ingredient.name} (${ingredient.quantity}g/ml) for Product ID ${ingredient.productId}`);
      } else {
        console.log(`---WARNING--- Ingredient already exists: ${ingredient.name} for Product ID ${ingredient.productId}`);
      }
    }
  }

  async revert(): Promise<void> {
    const ingredientRepo = this.dataSource.getRepository(Ingredient);
    
    // Eliminar ingredientes de los productos específicos que agregamos
    const productIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    await ingredientRepo.delete({ productId: productIds as any });
    console.log("---DELETED--- All Ingredients seed data removed");
  }
}