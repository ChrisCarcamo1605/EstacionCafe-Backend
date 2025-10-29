import { DataSource } from "typeorm";
import { SupplierSeeder } from "./SupplierSeeder";
import { ConsumableTypeSeeder } from "./ConsumableTypeSeeder";
import { UserTypeSeeder } from "./UserTypeSeeder";
import { CashRegisterSeeder } from "./CashRegisterSeeder";
import { ConsumableSeeder } from "./ConsumableSeeder";
import { ProductSeeder } from "./ProductSeeder";
import { UserSeeder } from "./UserSeeder";
import { IngredientSeeder } from "./IngredientSeeder";
import { PurchaseSeeder } from "./PurchaseSeeder";
import { BillSeeder } from "./BillSeeder";
import { BillDetailsSeeder } from "./BillDetailsSeeder";

export class DatabaseSeeder {
  private dataSource: DataSource;
  private seeders: any[];

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    // Orden de dependencias:
    // 1. Entidades independientes primero
    // 2. Entidades que dependen de otras después
    this.seeders = [
      new SupplierSeeder(dataSource),           // Independiente
      new ConsumableTypeSeeder(dataSource),     // Independiente  
      new UserTypeSeeder(dataSource),           // Independiente
      new CashRegisterSeeder(dataSource),       // Independiente
      new ProductSeeder(dataSource),            // Independiente
      new ConsumableSeeder(dataSource),         // Depende de Supplier y ConsumableType
      new UserSeeder(dataSource),               // Depende de UserType
      new IngredientSeeder(dataSource),         // Depende de Product y Consumable
      new PurchaseSeeder(dataSource),           // Depende de Supplier
      new BillSeeder(dataSource),               // Depende de CashRegister
      new BillDetailsSeeder(dataSource),        // Depende de Bill y Product
    ];
  }

  async runAll(): Promise<void> {
    console.log("Starting database seeding...");
    
    for (const seeder of this.seeders) {
      console.log(`Running ${seeder.constructor.name}...`);
      await seeder.run();
    }
    
    console.log("---COMPLETED---Database seeding completed!");
  }

  async revertAll(): Promise<void> {
    console.log("---REVERTED--- Reverting database seeds...");
    
    // Revertir en orden inverso
    const reversedSeeders = [...this.seeders].reverse();
    
    for (const seeder of reversedSeeders) {
      console.log(`Reverting ${seeder.constructor.name}...`);
      await seeder.revert();
    }
    
    console.log("---COMPLETED---  Database seeds reverted!");
  }
}