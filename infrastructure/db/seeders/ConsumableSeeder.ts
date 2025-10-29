import { DataSource } from "typeorm";
import { BaseSeeder } from "./BaseSeeder";
import { Consumable } from "../../../core/entities/Consumable";
import { UnitMeasurement } from "../../../core/enums/UnitMeasurement";

export class ConsumableSeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const consumableRepo = this.dataSource.getRepository(Consumable);
    
    const consumables = [
      // Café en Grano (tipo 1)
      { supplierId: 1, name: "Café Arábica Premium Colombia", cosumableTypeId: 1, quantity: 50.0, unitMeasurement: UnitMeasurement.KILOGRAM, cost: 28.50, active: true },
      { supplierId: 1, name: "Café Robusta Brasil", cosumableTypeId: 1, quantity: 40.0, unitMeasurement: UnitMeasurement.KILOGRAM, cost: 22.00, active: true },
      { supplierId: 2, name: "Café Orgánico Guatemala", cosumableTypeId: 1, quantity: 25.0, unitMeasurement: UnitMeasurement.KILOGRAM, cost: 35.75, active: true },
      
      // Café Molido (tipo 2)
      { supplierId: 1, name: "Espresso Blend Italiano", cosumableTypeId: 2, quantity: 30.0, unitMeasurement: UnitMeasurement.KILOGRAM, cost: 32.00, active: true },
      { supplierId: 2, name: "House Blend Americano", cosumableTypeId: 2, quantity: 45.0, unitMeasurement: UnitMeasurement.KILOGRAM, cost: 26.50, active: true },
      
      // Lácteos (tipo 3)
      { supplierId: 3, name: "Leche Entera Pasteurizada", cosumableTypeId: 3, quantity: 80.0, unitMeasurement: UnitMeasurement.LITER, cost: 2.15, active: true },
      { supplierId: 3, name: "Leche Descremada", cosumableTypeId: 3, quantity: 60.0, unitMeasurement: UnitMeasurement.LITER, cost: 2.05, active: true },
      { supplierId: 10, name: "Leche de Almendras", cosumableTypeId: 10, quantity: 40.0, unitMeasurement: UnitMeasurement.LITER, cost: 4.50, active: true },
      { supplierId: 10, name: "Leche de Avena", cosumableTypeId: 10, quantity: 35.0, unitMeasurement: UnitMeasurement.LITER, cost: 4.25, active: true },
      
      // Chocolate (tipo 4)
      { supplierId: 4, name: "Chocolate en Polvo Premium", cosumableTypeId: 4, quantity: 20.0, unitMeasurement: UnitMeasurement.KILOGRAM, cost: 18.75, active: true },
      { supplierId: 4, name: "Cacao Orgánico", cosumableTypeId: 4, quantity: 15.0, unitMeasurement: UnitMeasurement.KILOGRAM, cost: 24.80, active: true },
      
      // Té y Infusiones (tipo 5)
      { supplierId: 5, name: "Té Verde Matcha Japonés", cosumableTypeId: 5, quantity: 5.0, unitMeasurement: UnitMeasurement.KILOGRAM, cost: 65.00, active: true },
      { supplierId: 5, name: "Té Negro Earl Grey", cosumableTypeId: 5, quantity: 8.0, unitMeasurement: UnitMeasurement.KILOGRAM, cost: 28.50, active: true },
      { supplierId: 5, name: "Té de Manzanilla", cosumableTypeId: 5, quantity: 6.0, unitMeasurement: UnitMeasurement.KILOGRAM, cost: 22.00, active: true },
      
      // Azúcar y Endulzantes (tipo 6)
      { supplierId: 6, name: "Azúcar Refinada", cosumableTypeId: 6, quantity: 100.0, unitMeasurement: UnitMeasurement.KILOGRAM, cost: 1.85, active: true },
      { supplierId: 6, name: "Azúcar Morena", cosumableTypeId: 6, quantity: 50.0, unitMeasurement: UnitMeasurement.KILOGRAM, cost: 2.15, active: true },
      { supplierId: 6, name: "Stevia Natural", cosumableTypeId: 6, quantity: 2.0, unitMeasurement: UnitMeasurement.KILOGRAM, cost: 45.00, active: true },
      
      // Vasos y Contenedores (tipo 7)
      { supplierId: 7, name: "Vasos Cartón 8oz", cosumableTypeId: 7, quantity: 2000.0, unitMeasurement: UnitMeasurement.UNIT, cost: 0.12, active: true },
      { supplierId: 7, name: "Vasos Cartón 12oz", cosumableTypeId: 7, quantity: 1500.0, unitMeasurement: UnitMeasurement.UNIT, cost: 0.15, active: true },
      { supplierId: 7, name: "Vasos Cartón 16oz", cosumableTypeId: 7, quantity: 1000.0, unitMeasurement: UnitMeasurement.UNIT, cost: 0.18, active: true },
      
      // Especias y Saborizantes (tipo 8)
      { supplierId: 8, name: "Canela en Polvo", cosumableTypeId: 8, quantity: 3.0, unitMeasurement: UnitMeasurement.KILOGRAM, cost: 15.50, active: true },
      { supplierId: 8, name: "Vainilla Natural", cosumableTypeId: 8, quantity: 1.0, unitMeasurement: UnitMeasurement.LITER, cost: 85.00, active: true },
      
      // Siropes y Jarabes (tipo 9)
      { supplierId: 9, name: "Sirope de Vainilla", cosumableTypeId: 9, quantity: 12.0, unitMeasurement: UnitMeasurement.LITER, cost: 8.50, active: true },
      { supplierId: 9, name: "Sirope de Caramelo", cosumableTypeId: 9, quantity: 10.0, unitMeasurement: UnitMeasurement.LITER, cost: 9.25, active: true },
      { supplierId: 9, name: "Sirope de Avellana", cosumableTypeId: 9, quantity: 8.0, unitMeasurement: UnitMeasurement.LITER, cost: 10.75, active: true }
    ];

    for (const consumable of consumables) {
      const exists = await consumableRepo.findOne({ 
        where: { name: consumable.name } 
      });
      
      if (!exists) {
        await consumableRepo.save(consumable);
        console.log(`---SUCESS--- Consumable created: ${consumable.name} (${consumable.quantity} ${consumable.unitMeasurement})`);
      } else {
        console.log(`---WARNING--- Consumable already exists: ${consumable.name}`);
      }
    }
  }

  async revert(): Promise<void> {
    const consumableRepo = this.dataSource.getRepository(Consumable);
    
    // Eliminar consumables específicos que agregamos
    const consumableNames = [
      "Café Arábica Premium Colombia", "Café Robusta Brasil", "Café Orgánico Guatemala",
      "Espresso Blend Italiano", "House Blend Americano", "Leche Entera Pasteurizada",
      "Leche Descremada", "Leche de Almendras", "Leche de Avena", "Chocolate en Polvo Premium",
      "Cacao Orgánico", "Té Verde Matcha Japonés", "Té Negro Earl Grey", "Té de Manzanilla",
      "Azúcar Refinada", "Azúcar Morena", "Stevia Natural", "Vasos Cartón 8oz",
      "Vasos Cartón 12oz", "Vasos Cartón 16oz", "Canela en Polvo", "Vainilla Natural",
      "Sirope de Vainilla", "Sirope de Caramelo", "Sirope de Avellana"
    ];
    await consumableRepo.delete({ name: consumableNames as any });
    console.log("---DELETED--- All Consumables seed data removed");
  }
}