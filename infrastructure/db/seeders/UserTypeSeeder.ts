import { DataSource } from "typeorm";
import { BaseSeeder } from "./BaseSeeder";
import { UserType } from "../../../core/entities/UserType";

export class UserTypeSeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const userTypeRepo = this.dataSource.getRepository(UserType);
    
    const userTypes = [
      { name: "Super Administrador", permissionLevel: 10 },
      { name: "Administrador", permissionLevel: 9 },
      { name: "Gerente", permissionLevel: 8 },
      { name: "Supervisor", permissionLevel: 7 },
      { name: "Cajero Senior", permissionLevel: 6 },
      { name: "Cajero", permissionLevel: 5 },
      { name: "Barista Jefe", permissionLevel: 4 },
      { name: "Barista", permissionLevel: 3 },
      { name: "Asistente", permissionLevel: 2 },
      { name: "Trainee", permissionLevel: 1 },
      { name: "Auditor", permissionLevel: 6 },
      { name: "Inventario", permissionLevel: 4 }
    ];

    for (const userType of userTypes) {
      const exists = await userTypeRepo.findOne({ 
        where: { name: userType.name } 
      });
      
      if (!exists) {
        await userTypeRepo.save(userType);
        console.log(`---SUCESS--- UserType created: ${userType.name} (Level: ${userType.permissionLevel})`);
      } else {
        console.log(`---WARNING--- UserType already exists: ${userType.name}`);
      }
    }
  }

  async revert(): Promise<void> {
    const userTypeRepo = this.dataSource.getRepository(UserType);
    
    const userTypeNames = [
      "Super Administrador", "Administrador", "Gerente", "Supervisor",
      "Cajero Senior", "Cajero", "Barista Jefe", "Barista", 
      "Asistente", "Trainee", "Auditor", "Inventario"
    ];

    await userTypeRepo.delete({ name: userTypeNames as any });
    console.log("---DELETED--- UserTypes seed data removed");
  }
}