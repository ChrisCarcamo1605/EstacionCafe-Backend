import { DataSource } from "typeorm";
import { BaseSeeder } from "./BaseSeeder";
import { Product } from "../../../core/entities/Producto";

export class ProductSeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const productRepo = this.dataSource.getRepository(Product);
    
    const products = [
      // Cafés Espresso
      { name: "Espresso Solo", description: "Café espresso clásico, intenso y aromático servido en taza pequeña", price: 15.00, cost: 6.50, active: true },
      { name: "Espresso Doble", description: "Doble shot de espresso para los amantes del café fuerte", price: 22.00, cost: 9.50, active: true },
      { name: "Espresso Romano", description: "Espresso tradicional con una rodaja de limón", price: 16.50, cost: 7.00, active: true },
      
      // Cafés con Leche
      { name: "Cappuccino Clásico", description: "Espresso con leche vaporizada y espuma cremosa", price: 25.00, cost: 12.00, active: true },
      { name: "Latte Tradicional", description: "Café espresso con abundante leche vaporizada", price: 28.00, cost: 14.50, active: true },
      { name: "Flat White", description: "Espresso doble con leche microespumada al estilo australiano", price: 30.00, cost: 15.50, active: true },
      { name: "Macchiato", description: "Espresso 'manchado' con una cucharada de leche espumada", price: 20.00, cost: 9.00, active: true },
      
      // Cafés Especiales
      { name: "Mocha Premium", description: "Espresso con chocolate premium y leche vaporizada", price: 35.00, cost: 18.00, active: true },
      { name: "Caramel Macchiato", description: "Latte con sirope de caramelo y espuma de leche", price: 32.00, cost: 16.50, active: true },
      { name: "Americano", description: "Espresso diluido con agua caliente al estilo americano", price: 18.00, cost: 8.50, active: true },
      
      // Cafés Fríos
      { name: "Iced Latte", description: "Latte servido con hielo, perfecto para días calurosos", price: 30.00, cost: 15.00, active: true },
      { name: "Cold Brew", description: "Café extraído en frío durante 12 horas, suave y aromático", price: 26.00, cost: 12.50, active: true },
      { name: "Frappé Mocha", description: "Bebida helada con café, chocolate y crema batida", price: 38.00, cost: 20.00, active: true },
      
      // Tés y Otras Bebidas
      { name: "Té Matcha Latte", description: "Té verde matcha japonés con leche vaporizada", price: 32.00, cost: 16.00, active: true },
      { name: "Chai Latte", description: "Té especiado indio con leche y canela", price: 28.00, cost: 14.00, active: true },
      { name: "Chocolate Caliente Premium", description: "Chocolate belga con leche y marshmallows", price: 25.00, cost: 13.00, active: true }
    ];

    for (const product of products) {
      const exists = await productRepo.findOne({ 
        where: { name: product.name } 
      });
      
      if (!exists) {
        await productRepo.save(product);
        console.log(`---SUCESS--- Product created: ${product.name} ($${product.price})`);
      } else {
        console.log(`---WARNING--- Product already exists: ${product.name}`);
      }
    }
  }

  async revert(): Promise<void> {
    const productRepo = this.dataSource.getRepository(Product);
    
    // Eliminar productos específicos que agregamos
    const productNames = [
      "Espresso Solo", "Espresso Doble", "Espresso Romano", "Cappuccino Clásico",
      "Latte Tradicional", "Flat White", "Macchiato", "Mocha Premium",
      "Caramel Macchiato", "Americano", "Iced Latte", "Cold Brew",
      "Frappé Mocha", "Té Matcha Latte", "Chai Latte", "Chocolate Caliente Premium"
    ];
    await productRepo.delete({ name: productNames as any });
    console.log("---DELETED--- All Products seed data removed");
  }
}