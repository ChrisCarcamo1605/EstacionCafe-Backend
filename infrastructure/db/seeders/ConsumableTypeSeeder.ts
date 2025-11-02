import { DataSource, In } from "typeorm";
import { BaseSeeder } from "./BaseSeeder";
import { ConsumableType } from "../../../core/entities/ConsumableType";

export class ConsumableTypeSeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const consumableTypeRepo = this.dataSource.getRepository(ConsumableType);

    const consumableTypes = [
      { name: "Café en Grano" },
      { name: "Café Molido" },
      { name: "Lácteos" },
      { name: "Chocolate" },
      { name: "Té y Infusiones" },
      { name: "Azúcar y Endulzantes" },
      { name: "Vasos y Contenedores" },
      { name: "Especias y Saborizantes" },
      { name: "Siropes y Jarabes" },
      { name: "Cremas y Leches Vegetales" },
      { name: "Descartables" },
      { name: "Utensilios de Barista" },
      { name: "Materiales de Limpieza" },
      { name: "Snacks y Acompañantes" },
    ];

    for (const type of consumableTypes) {
      const exists = await consumableTypeRepo.findOne({
        where: { name: type.name },
      });

      if (!exists) {
        await consumableTypeRepo.save(type);
        console.log(`---SUCESS---  ConsumableType created: ${type.name}`);
      } else {
        console.log(
          `---WARNING---  ConsumableType already exists: ${type.name}`,
        );
      }
    }
  }

  async revert(): Promise<void> {
    const consumableTypeRepo = this.dataSource.getRepository(ConsumableType);

    const typeNames = [
      "Café en Grano",
      "Café Molido",
      "Lácteos",
      "Chocolate",
      "Té y Infusiones",
      "Azúcar y Endulzantes",
      "Vasos y Contenedores",
      "Especias y Saborizantes",
      "Siropes y Jarabes",
      "Cremas y Leches Vegetales",
      "Descartables",
      "Utensilios de Barista",
      "Materiales de Limpieza",
      "Snacks y Acompañantes",
    ];

    await consumableTypeRepo.delete({ name: In(typeNames) });
    console.log("---DELETED---  ConsumableTypes seed data removed");
  }
}
