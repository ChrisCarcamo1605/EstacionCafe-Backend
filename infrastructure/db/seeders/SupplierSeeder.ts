import { DataSource, In } from "typeorm";
import { BaseSeeder } from "./BaseSeeder";
import { Supplier } from "../../../core/entities/Supplier";

export class SupplierSeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const supplierRepo = this.dataSource.getRepository(Supplier);

    const suppliers = [
      {
        name: "Café Gourmet Internacional",
        phone: "555-1001",
        email: "ventas@cafegourmet.com",
        active: true,
      },
      {
        name: "Distribuidora Valle Verde",
        phone: "555-1002",
        email: "pedidos@valleverde.com",
        active: true,
      },
      {
        name: "Lácteos San Martín",
        phone: "555-1003",
        email: "comercial@lacteossm.com",
        active: true,
      },
      {
        name: "Chocolate Premium Corp",
        phone: "555-1004",
        email: "info@chocolatepremium.com",
        active: true,
      },
      {
        name: "Tés del Mundo Ltda",
        phone: "555-1005",
        email: "ventas@tesdelmundo.com",
        active: true,
      },
      {
        name: "Azucarera Nacional",
        phone: "555-1006",
        email: "corporativo@azucarera.com",
        active: true,
      },
      {
        name: "Empaques y Descartables",
        phone: "555-1007",
        email: "ventas@empaques.com",
        active: true,
      },
      {
        name: "Especias Aromáticas",
        phone: "555-1008",
        email: "pedidos@especias.com",
        active: true,
      },
      {
        name: "Siropes y Sabores",
        phone: "555-1009",
        email: "comercial@siropes.com",
        active: true,
      },
      {
        name: "Suministros Barista Pro",
        phone: "555-1010",
        email: "ventas@baristapro.com",
        active: true,
      },
      {
        name: "Productos de Limpieza Hosteleros",
        phone: "555-1011",
        email: "info@limpiezahostelera.com",
        active: true,
      },
      {
        name: "Snacks y Complementos",
        phone: "555-1012",
        email: "pedidos@snacksco.com",
        active: true,
      },
    ];

    // Solo insertar si no existen
    for (const supplier of suppliers) {
      const exists = await supplierRepo.findOne({
        where: { name: supplier.name },
      });

      if (!exists) {
        await supplierRepo.save(supplier);
        console.log(`---SUCESS--- Supplier created: ${supplier.name}`);
      } else {
        console.log(`---WARNING--- Supplier already exists: ${supplier.name}`);
      }
    }
  }

  async revert(): Promise<void> {
    const supplierRepo = this.dataSource.getRepository(Supplier);

    const supplierNames = [
      "Café Gourmet Internacional",
      "Distribuidora Valle Verde",
      "Lácteos San Martín",
      "Chocolate Premium Corp",
      "Tés del Mundo Ltda",
      "Azucarera Nacional",
      "Empaques y Descartables",
      "Especias Aromáticas",
      "Siropes y Sabores",
      "Suministros Barista Pro",
      "Productos de Limpieza Hosteleros",
      "Snacks y Complementos",
    ];

    await supplierRepo.delete({ name: In(supplierNames) });
    console.log("---DELETED--- Suppliers seed data removed");
  }
}
