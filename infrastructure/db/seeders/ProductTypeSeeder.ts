import { DataSource, In } from "typeorm";
import { BaseSeeder } from "./BaseSeeder";
import { ProductType } from "../../../core/entities/ProductType";

export class ProductTypeSeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const productTypeRepo = this.dataSource.getRepository(ProductType);

    const productTypes = [
      { name: "Bebidas Calientes" },
      { name: "Bebidas Frías" },
      { name: "Almuerzos" },
      { name: "Cenas" },
      { name: "Desayunos" },
      { name: "Postres" },
      { name: "Snacks y Acompañantes" },
      { name: "Especialidades de la Casa" },
      { name: "Bebidas sin Cafeína" },
    ];

    for (const type of productTypes) {
      const exists = await productTypeRepo.findOne({
        where: { name: type.name },
      });

      if (!exists) {
        await productTypeRepo.save(type);
        console.log(`---SUCCESS---  ProductType created: ${type.name}`);
      } else {
        console.log(`---WARNING---  ProductType already exists: ${type.name}`);
      }
    }
  }

  async revert(): Promise<void> {
    const productTypeRepo = this.dataSource.getRepository(ProductType);

    const typeNames = [
      "Bebidas Calientes",
      "Bebidas Frías",
      "Almuerzos",
      "Cenas",
      "Desayunos",
      "Postres",
      "Snacks y Acompañantes",
      "Especialidades de la Casa",
      "Bebidas sin Cafeína",
    ];

    await productTypeRepo.delete({ name: In(typeNames) });
    console.log("---DELETED---  ProductTypes seed data removed");
  }
}
