import { DataSource, In } from "typeorm";
import { BaseSeeder } from "./BaseSeeder";
import { CashRegister } from "../../../core/entities/CashRegister";

export class CashRegisterSeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const cashRegisterRepo = this.dataSource.getRepository(CashRegister);

    const cashRegisters = [
      { number: "CAJA-001", active: true },
      { number: "CAJA-002", active: true },
      { number: "CAJA-003", active: true },
      { number: "CAJA-004", active: false }, // Caja de mantenimiento
      { number: "CAJA-005", active: true },
      { number: "CAJA-DRIVE", active: true }, // Caja para drive-thru
      { number: "CAJA-DELIVERY", active: true }, // Caja para delivery
      { number: "CAJA-EVENTOS", active: false }, // Caja para eventos especiales
      { number: "CAJA-VIP", active: true }, // Caja VIP
      { number: "CAJA-EXPRESS", active: true }, // Caja express
      { number: "CAJA-BACKUP", active: false }, // Caja de respaldo
      { number: "CAJA-TRAINING", active: false }, // Caja para entrenamiento
    ];

    for (const cashRegister of cashRegisters) {
      const exists = await cashRegisterRepo.findOne({
        where: { number: cashRegister.number },
      });

      if (!exists) {
        await cashRegisterRepo.save(cashRegister);
        console.log(
          `---SUCESS---  CashRegister created: ${cashRegister.number} (Active: ${cashRegister.active})`,
        );
      } else {
        console.log(
          `---WARNING---  CashRegister already exists: ${cashRegister.number}`,
        );
      }
    }
  }

  async revert(): Promise<void> {
    const cashRegisterRepo = this.dataSource.getRepository(CashRegister);

    const cashRegisterNumbers = [
      "CAJA-001",
      "CAJA-002",
      "CAJA-003",
      "CAJA-004",
      "CAJA-005",
      "CAJA-DRIVE",
      "CAJA-DELIVERY",
      "CAJA-EVENTOS",
      "CAJA-VIP",
      "CAJA-EXPRESS",
      "CAJA-BACKUP",
      "CAJA-TRAINING",
    ];

    await cashRegisterRepo.delete({ number: In(cashRegisterNumbers) });
    console.log("---DELETED---  CashRegisters seed data removed");
  }
}
