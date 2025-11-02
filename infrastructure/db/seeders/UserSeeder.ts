import { DataSource, In } from "typeorm";
import { BaseSeeder } from "./BaseSeeder";
import { User } from "../../../core/entities/User";
import * as bcrypt from "bcrypt";

export class UserSeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const userRepo = this.dataSource.getRepository(User);

    // Hash password para todos los usuarios (en producción usar diferentes passwords)
    const defaultPassword = await bcrypt.hash("EstacionCafe2025!", 10);

    const users = [
      // Super Administrador
      {
        username: "Christian",
        userTypeId: 1,
        password: defaultPassword,
        email: "admin@estacioncafe.com",
        active: true,
      },

      // Administradores
      {
        username: "Christopher",
        userTypeId: 1,
        password: defaultPassword,
        email: "admin.principal@estacioncafe.com",
        active: true,
      },
      {
        username: "Emerson",
        userTypeId: 1,
        password: defaultPassword,
        email: "sistemas@estacioncafe.com",
        active: true,
      },

      // Gerentes
      {
        username: "gerente.general",
        userTypeId: 3,
        password: defaultPassword,
        email: "gerente@estacioncafe.com",
        active: true,
      },
      {
        username: "gerente.turno1",
        userTypeId: 3,
        password: defaultPassword,
        email: "gerente.turno1@estacioncafe.com",
        active: true,
      },

      // Supervisores
      {
        username: "supervisor.mañana",
        userTypeId: 4,
        password: defaultPassword,
        email: "supervisor.am@estacioncafe.com",
        active: true,
      },
      {
        username: "supervisor.tarde",
        userTypeId: 4,
        password: defaultPassword,
        email: "supervisor.pm@estacioncafe.com",
        active: true,
      },

      // Cajeros Senior
      {
        username: "cajero.senior1",
        userTypeId: 5,
        password: defaultPassword,
        email: "cajero.s1@estacioncafe.com",
        active: true,
      },
      {
        username: "cajero.senior2",
        userTypeId: 5,
        password: defaultPassword,
        email: "cajero.s2@estacioncafe.com",
        active: true,
      },

      // Cajeros
      {
        username: "cajero.maria",
        userTypeId: 6,
        password: defaultPassword,
        email: "maria.cajero@estacioncafe.com",
        active: true,
      },
      {
        username: "cajero.juan",
        userTypeId: 6,
        password: defaultPassword,
        email: "juan.cajero@estacioncafe.com",
        active: true,
      },
      {
        username: "cajero.ana",
        userTypeId: 6,
        password: defaultPassword,
        email: "ana.cajero@estacioncafe.com",
        active: true,
      },

      // Baristas Jefe
      {
        username: "barista.jefe1",
        userTypeId: 7,
        password: defaultPassword,
        email: "barista.jefe1@estacioncafe.com",
        active: true,
      },

      // Baristas
      {
        username: "barista.carlos",
        userTypeId: 8,
        password: defaultPassword,
        email: "carlos.barista@estacioncafe.com",
        active: true,
      },
      {
        username: "barista.lucia",
        userTypeId: 8,
        password: defaultPassword,
        email: "lucia.barista@estacioncafe.com",
        active: true,
      },
      {
        username: "barista.diego",
        userTypeId: 8,
        password: defaultPassword,
        email: "diego.barista@estacioncafe.com",
        active: true,
      },

      // Asistentes
      {
        username: "asistente.pedro",
        userTypeId: 9,
        password: defaultPassword,
        email: "pedro.asistente@estacioncafe.com",
        active: true,
      },
      {
        username: "asistente.sofia",
        userTypeId: 9,
        password: defaultPassword,
        email: "sofia.asistente@estacioncafe.com",
        active: true,
      },

      // Trainee
      {
        username: "trainee.nuevo1",
        userTypeId: 10,
        password: defaultPassword,
        email: "trainee1@estacioncafe.com",
        active: true,
      },

      // Auditor
      {
        username: "auditor.externo",
        userTypeId: 11,
        password: defaultPassword,
        email: "auditor@estacioncafe.com",
        active: true,
      },

      // Inventario
      {
        username: "inventario.responsable",
        userTypeId: 12,
        password: defaultPassword,
        email: "inventario@estacioncafe.com",
        active: true,
      },
    ];

    for (const user of users) {
      const exists = await userRepo.findOne({
        where: { username: user.username },
      });

      if (!exists) {
        await userRepo.save(user);
        console.log(
          `---SUCESS--- User created: ${user.username} (Type: ${user.userTypeId})`,
        );
      } else {
        console.log(`---WARNING--- User already exists: ${user.username}`);
      }
    }
  }

  async revert(): Promise<void> {
    const userRepo = this.dataSource.getRepository(User);

    const usernames = [
      "Christian",
      "Christopher",
      "Emerson",
      "gerente.general",
      "gerente.turno1",
      "supervisor.mañana",
      "supervisor.tarde",
      "cajero.senior1",
      "cajero.senior2",
      "cajero.maria",
      "cajero.juan",
      "cajero.ana",
      "barista.jefe1",
      "barista.carlos",
      "barista.lucia",
      "barista.diego",
      "asistente.pedro",
      "asistente.sofia",
      "trainee.nuevo1",
      "auditor.externo",
      "inventario.responsable",
    ];

    await userRepo.delete({ username: In(usernames) });
    console.log("---DELETED--- Users seed data removed");
  }
}
