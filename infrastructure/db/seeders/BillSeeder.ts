import { DataSource, In } from "typeorm";
import { BaseSeeder } from "./BaseSeeder";
import { Bill } from "../../../core/entities/Bill";
import { Status } from "../../../core/enums/Status";

export class BillSeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const billRepo = this.dataSource.getRepository(Bill);

    // Fechas de los últimos 30 días para simular actividad reciente
    const today = new Date();
    const dates: Date[] = [];

    // Generar fechas de los últimos 30 días
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date);
    }

    const customerNames = [
      "Ana García",
      "Carlos López",
      "María Rodríguez",
      "José Martínez",
      "Laura Hernández",
      "Miguel Sánchez",
      "Carmen Jiménez",
      "Francisco Moreno",
      "Isabel Álvarez",
      "Antonio Ruiz",
      "Pilar Vega",
      "Manuel Torres",
      "Rosa Díaz",
      "Pedro Ramírez",
      "Lucía Flores",
      "Ángel Serrano",
      "Cliente Regular",
      "Cliente VIP",
      "Estudiante",
      "Turista",
    ];

    const bills = [
      // Facturas del último mes - TODAS CERRADAS (históricas)
      // NO incluyen tableId porque el subscriber las habría limpiado al cerrarlas
      // Día 1 (hace 29 días)
      {
        cashRegisterId: 1,
        customer: customerNames[0],
        date: dates[0],
        total: 45.0,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[1],
        date: dates[0],
        total: 28.0,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[2],
        date: dates[0],
        total: 62.5,
        status: Status.CLOSED,
      },

      // Día 2
      {
        cashRegisterId: 1,
        customer: customerNames[3],
        date: dates[1],
        total: 35.0,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[4],
        date: dates[1],
        total: 18.0,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[5],
        date: dates[1],
        total: 52.75,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[6],
        date: dates[1],
        total: 25.0,
        status: Status.CLOSED,
      },

      // Día 3
      {
        cashRegisterId: 1,
        customer: customerNames[7],
        date: dates[2],
        total: 73.5,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[8],
        date: dates[2],
        total: 30.0,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[9],
        date: dates[2],
        total: 41.25,
        status: Status.CLOSED,
      },

      // Día 4
      {
        cashRegisterId: 1,
        customer: customerNames[10],
        date: dates[3],
        total: 56.0,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[11],
        date: dates[3],
        total: 22.5,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[12],
        date: dates[3],
        total: 38.75,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[13],
        date: dates[3],
        total: 15.0,
        status: Status.CLOSED,
      },

      // Día 5 (fin de semana - más actividad)
      {
        cashRegisterId: 1,
        customer: customerNames[14],
        date: dates[4],
        total: 89.5,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[15],
        date: dates[4],
        total: 67.25,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[16],
        date: dates[4],
        total: 43.0,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[17],
        date: dates[4],
        total: 55.75,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[18],
        date: dates[4],
        total: 32.5,
        status: Status.CLOSED,
      },

      // Día 6 (fin de semana)
      {
        cashRegisterId: 1,
        customer: customerNames[19],
        date: dates[5],
        total: 78.0,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[0],
        date: dates[5],
        total: 91.25,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[1],
        date: dates[5],
        total: 46.5,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[2],
        date: dates[5],
        total: 29.75,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[3],
        date: dates[5],
        total: 63.0,
        status: Status.CLOSED,
      },

      // Días 7-15 (actividad regular - todas cerradas)
      {
        cashRegisterId: 1,
        customer: customerNames[4],
        date: dates[6],
        total: 48.25,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[5],
        date: dates[6],
        total: 31.5,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[6],
        date: dates[7],
        total: 54.75,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[7],
        date: dates[7],
        total: 27.0,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[8],
        date: dates[8],
        total: 42.5,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[9],
        date: dates[8],
        total: 36.25,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[10],
        date: dates[9],
        total: 59.0,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[11],
        date: dates[9],
        total: 24.75,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[12],
        date: dates[10],
        total: 47.5,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[13],
        date: dates[10],
        total: 33.25,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[14],
        date: dates[11],
        total: 65.75,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[15],
        date: dates[11],
        total: 28.5,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[16],
        date: dates[12],
        total: 51.25,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[17],
        date: dates[12],
        total: 39.75,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[18],
        date: dates[13],
        total: 44.0,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[19],
        date: dates[13],
        total: 26.25,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[0],
        date: dates[14],
        total: 58.5,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[1],
        date: dates[14],
        total: 34.75,
        status: Status.CLOSED,
      },

      // Días más recientes (últimas 2 semanas - cerradas)
      {
        cashRegisterId: 1,
        customer: customerNames[2],
        date: dates[15],
        total: 72.25,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[3],
        date: dates[15],
        total: 41.5,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[4],
        date: dates[16],
        total: 35.75,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[5],
        date: dates[16],
        total: 49.25,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[6],
        date: dates[17],
        total: 56.5,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[7],
        date: dates[17],
        total: 23.75,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[8],
        date: dates[18],
        total: 68.0,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[9],
        date: dates[18],
        total: 37.25,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[10],
        date: dates[19],
        total: 52.75,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[11],
        date: dates[19],
        total: 29.5,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[12],
        date: dates[20],
        total: 45.25,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[13],
        date: dates[20],
        total: 61.75,
        status: Status.CLOSED,
      },

      // Última semana (actividad alta - cerradas)
      {
        cashRegisterId: 1,
        customer: customerNames[14],
        date: dates[21],
        total: 83.5,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[15],
        date: dates[21],
        total: 47.25,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[16],
        date: dates[22],
        total: 39.75,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[17],
        date: dates[22],
        total: 54.0,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[18],
        date: dates[23],
        total: 66.25,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[19],
        date: dates[23],
        total: 32.5,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[0],
        date: dates[24],
        total: 48.75,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[1],
        date: dates[24],
        total: 71.0,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[2],
        date: dates[25],
        total: 43.25,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[3],
        date: dates[25],
        total: 58.5,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[4],
        date: dates[26],
        total: 36.75,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[5],
        date: dates[26],
        total: 49.0,
        status: Status.CLOSED,
      },

      // Últimos 3 días (cerradas)
      {
        cashRegisterId: 1,
        customer: customerNames[6],
        date: dates[27],
        total: 87.25,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[7],
        date: dates[27],
        total: 52.75,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[8],
        date: dates[28],
        total: 64.5,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[9],
        date: dates[28],
        total: 38.25,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[10],
        date: dates[29],
        total: 75.0,
        status: Status.CLOSED,
      },
      {
        cashRegisterId: 1,
        customer: customerNames[11],
        date: dates[29],
        total: 41.75,
        status: Status.CLOSED,
      },

      // ===== CUENTAS ABIERTAS (HOY) - MESAS OCUPADAS =====
      // Estas facturas tienen status OPEN y tableId asignado
      // El subscriber automáticamente marcará estas mesas como "ocupada"

      // ZONA A - 2 mesas ocupadas
      {
        cashRegisterId: 1,
        customer: "Familia González",
        date: new Date(), // HOY
        total: 95.5,
        status: Status.OPEN,
        tableId: "A1", // Esta mesa quedará OCUPADA
      },
      {
        cashRegisterId: 1,
        customer: "Pareja Joven",
        date: new Date(),
        total: 42.75,
        status: Status.OPEN,
        tableId: "A3", // Esta mesa quedará OCUPADA
      },

      // ZONA B - 1 mesa ocupada
      {
        cashRegisterId: 1,
        customer: "Grupo de Amigos",
        date: new Date(),
        total: 128.0,
        status: Status.OPEN,
        tableId: "B2", // Esta mesa quedará OCUPADA
      },

      // ZONA VIP - 2 mesas ocupadas
      {
        cashRegisterId: 1,
        customer: "Cliente Corporativo",
        date: new Date(),
        total: 215.5,
        status: Status.OPEN,
        tableId: "VIP1", // Esta mesa quedará OCUPADA
      },
      {
        cashRegisterId: 1,
        customer: "Celebración Aniversario",
        date: new Date(),
        total: 187.25,
        status: Status.OPEN,
        tableId: "VIP3", // Esta mesa quedará OCUPADA
      },

      // ZONA C (Terraza) - 3 mesas ocupadas
      {
        cashRegisterId: 1,
        customer: "Estudiantes",
        date: new Date(),
        total: 56.75,
        status: Status.OPEN,
        tableId: "C2", // Esta mesa quedará OCUPADA
      },
      {
        cashRegisterId: 1,
        customer: "Familia Ramírez",
        date: new Date(),
        total: 103.5,
        status: Status.OPEN,
        tableId: "C4", // Esta mesa quedará OCUPADA
      },
      {
        cashRegisterId: 1,
        customer: "Turistas",
        date: new Date(),
        total: 78.25,
        status: Status.OPEN,
        tableId: "C6", // Esta mesa quedará OCUPADA
      },

      // ZONA D (Barra) - 1 mesa ocupada
      {
        cashRegisterId: 1,
        customer: "Cliente Regular Solo",
        date: new Date(),
        total: 24.5,
        status: Status.OPEN,
        tableId: "D1", // Esta mesa quedará OCUPADA
      },

      // Total: 9 mesas ocupadas de 21 (43% de ocupación)
      // Resto de mesas quedan DISPONIBLES
    ];

    for (const bill of bills) {
      const exists = await billRepo.findOne({
        where: {
          customer: bill.customer,
          date: bill.date,
          total: bill.total,
        },
      });

      if (!exists) {
        await billRepo.save(bill);
        console.log(
          `---SUCESS---  Bill created: ${bill.customer} - $${bill.total} on ${bill.date.toDateString()}`,
        );
      } else {
        console.log(
          `---WARNING---  Bill already exists: ${bill.customer} - $${bill.total}`,
        );
      }
    }
  }

  async revert(): Promise<void> {
    const billRepo = this.dataSource.getRepository(Bill);

    // Eliminar facturas de los clientes específicos que agregamos
    const customerNames = [
      "Ana García",
      "Carlos López",
      "María Rodríguez",
      "José Martínez",
      "Laura Hernández",
      "Miguel Sánchez",
      "Carmen Jiménez",
      "Francisco Moreno",
      "Isabel Álvarez",
      "Antonio Ruiz",
      "Pilar Vega",
      "Manuel Torres",
      "Rosa Díaz",
      "Pedro Ramírez",
      "Lucía Flores",
      "Ángel Serrano",
      "Cliente Regular",
      "Cliente VIP",
      "Estudiante",
      "Turista",
    ];
    await billRepo.delete({ customer: In(customerNames) });
    console.log("---DELETED---  All Bills seed data removed");
  }
}
