import { DataSource, In } from "typeorm";
import { BaseSeeder } from "./BaseSeeder";
import { Table, TableStatus } from "../../../core/entities/Table";

export class TableSeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const tableRepo = this.dataSource.getRepository(Table);

    const tables = [
      // ZONA A - Área Interior Principal
      {
        tableId: "A1",
        zone: "ZONA A",
        status: TableStatus.DISPONIBLE,
      },
      {
        tableId: "A2",
        zone: "ZONA A",
        status: TableStatus.DISPONIBLE,
      },
      {
        tableId: "A3",
        zone: "ZONA A",
        status: TableStatus.DISPONIBLE,
      },
      {
        tableId: "A4",
        zone: "ZONA A",
        status: TableStatus.DISPONIBLE,
      },
      {
        tableId: "A5",
        zone: "ZONA A",
        status: TableStatus.DISPONIBLE,
      },

      // ZONA B - Área de Ventanas
      {
        tableId: "B1",
        zone: "ZONA B",
        status: TableStatus.DISPONIBLE,
      },
      {
        tableId: "B2",
        zone: "ZONA B",
        status: TableStatus.DISPONIBLE,
      },
      {
        tableId: "B3",
        zone: "ZONA B",
        status: TableStatus.DISPONIBLE,
      },
      {
        tableId: "B4",
        zone: "ZONA B",
        status: TableStatus.DISPONIBLE,
      },

      // ZONA C - Área Terraza/Exterior
      {
        tableId: "C1",
        zone: "ZONA C",
        status: TableStatus.DISPONIBLE,
      },
      {
        tableId: "C2",
        zone: "ZONA C",
        status: TableStatus.DISPONIBLE,
      },
      {
        tableId: "C3",
        zone: "ZONA C",
        status: TableStatus.DISPONIBLE,
      },
      {
        tableId: "C4",
        zone: "ZONA C",
        status: TableStatus.DISPONIBLE,
      },
      {
        tableId: "C5",
        zone: "ZONA C",
        status: TableStatus.DISPONIBLE,
      },
      {
        tableId: "C6",
        zone: "ZONA C",
        status: TableStatus.DISPONIBLE,
      },

      // ZONA VIP - Área Privada/Premium
      {
        tableId: "VIP1",
        zone: "ZONA VIP",
        status: TableStatus.DISPONIBLE,
      },
      {
        tableId: "VIP2",
        zone: "ZONA VIP",
        status: TableStatus.DISPONIBLE,
      },
      {
        tableId: "VIP3",
        zone: "ZONA VIP",
        status: TableStatus.DISPONIBLE,
      },

      // ZONA D - Área de Barra
      {
        tableId: "D1",
        zone: "ZONA D",
        status: TableStatus.DISPONIBLE,
      },
      {
        tableId: "D2",
        zone: "ZONA D",
        status: TableStatus.DISPONIBLE,
      },
      {
        tableId: "D3",
        zone: "ZONA D",
        status: TableStatus.DISPONIBLE,
      },
    ];

    for (const table of tables) {
      const exists = await tableRepo.findOne({
        where: { tableId: table.tableId },
      });

      if (!exists) {
        await tableRepo.save(table);
        console.log(
          `---SUCCESS--- Table created: ${table.tableId} in ${table.zone} (${table.status})`,
        );
      } else {
        console.log(`---WARNING--- Table already exists: ${table.tableId}`);
      }
    }
  }

  async revert(): Promise<void> {
    const tableRepo = this.dataSource.getRepository(Table);

    // Eliminar las mesas específicas que agregamos
    const tableIds = [
      "A1",
      "A2",
      "A3",
      "A4",
      "A5",
      "B1",
      "B2",
      "B3",
      "B4",
      "C1",
      "C2",
      "C3",
      "C4",
      "C5",
      "C6",
      "VIP1",
      "VIP2",
      "VIP3",
      "D1",
      "D2",
      "D3",
    ];

    await tableRepo.delete({ tableId: In(tableIds) });
    console.log("---DELETED--- All Tables seed data removed");
  }
}
