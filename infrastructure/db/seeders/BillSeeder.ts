import { DataSource } from "typeorm";
import { BaseSeeder } from "./BaseSeeder";
import { Bill } from "../../../core/entities/Bill";

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
      "Ana García", "Carlos López", "María Rodríguez", "José Martínez", 
      "Laura Hernández", "Miguel Sánchez", "Carmen Jiménez", "Francisco Moreno",
      "Isabel Álvarez", "Antonio Ruiz", "Pilar Vega", "Manuel Torres",
      "Rosa Díaz", "Pedro Ramírez", "Lucía Flores", "Ángel Serrano",
      "Cliente Regular", "Cliente VIP", "Estudiante", "Turista"
    ];

    const bills = [
      // Facturas del último mes con diferentes patrones de venta
      // Día 1 (hace 29 días)
      { cashRegisterId: 1, customer: customerNames[0], date: dates[0], total: 45.00 },
      { cashRegisterId: 1, customer: customerNames[1], date: dates[0], total: 28.00 },
      { cashRegisterId: 1, customer: customerNames[2], date: dates[0], total: 62.50 },
      
      // Día 2
      { cashRegisterId: 1, customer: customerNames[3], date: dates[1], total: 35.00 },
      { cashRegisterId: 1, customer: customerNames[4], date: dates[1], total: 18.00 },
      { cashRegisterId: 1, customer: customerNames[5], date: dates[1], total: 52.75 },
      { cashRegisterId: 1, customer: customerNames[6], date: dates[1], total: 25.00 },
      
      // Día 3
      { cashRegisterId: 1, customer: customerNames[7], date: dates[2], total: 73.50 },
      { cashRegisterId: 1, customer: customerNames[8], date: dates[2], total: 30.00 },
      { cashRegisterId: 1, customer: customerNames[9], date: dates[2], total: 41.25 },
      
      // Día 4
      { cashRegisterId: 1, customer: customerNames[10], date: dates[3], total: 56.00 },
      { cashRegisterId: 1, customer: customerNames[11], date: dates[3], total: 22.50 },
      { cashRegisterId: 1, customer: customerNames[12], date: dates[3], total: 38.75 },
      { cashRegisterId: 1, customer: customerNames[13], date: dates[3], total: 15.00 },
      
      // Día 5 (fin de semana - más actividad)
      { cashRegisterId: 1, customer: customerNames[14], date: dates[4], total: 89.50 },
      { cashRegisterId: 1, customer: customerNames[15], date: dates[4], total: 67.25 },
      { cashRegisterId: 1, customer: customerNames[16], date: dates[4], total: 43.00 },
      { cashRegisterId: 1, customer: customerNames[17], date: dates[4], total: 55.75 },
      { cashRegisterId: 1, customer: customerNames[18], date: dates[4], total: 32.50 },
      
      // Día 6 (fin de semana)
      { cashRegisterId: 1, customer: customerNames[19], date: dates[5], total: 78.00 },
      { cashRegisterId: 1, customer: customerNames[0], date: dates[5], total: 91.25 },
      { cashRegisterId: 1, customer: customerNames[1], date: dates[5], total: 46.50 },
      { cashRegisterId: 1, customer: customerNames[2], date: dates[5], total: 29.75 },
      { cashRegisterId: 1, customer: customerNames[3], date: dates[5], total: 63.00 },
      
      // Días 7-15 (actividad regular)
      { cashRegisterId: 1, customer: customerNames[4], date: dates[6], total: 48.25 },
      { cashRegisterId: 1, customer: customerNames[5], date: dates[6], total: 31.50 },
      { cashRegisterId: 1, customer: customerNames[6], date: dates[7], total: 54.75 },
      { cashRegisterId: 1, customer: customerNames[7], date: dates[7], total: 27.00 },
      { cashRegisterId: 1, customer: customerNames[8], date: dates[8], total: 42.50 },
      { cashRegisterId: 1, customer: customerNames[9], date: dates[8], total: 36.25 },
      { cashRegisterId: 1, customer: customerNames[10], date: dates[9], total: 59.00 },
      { cashRegisterId: 1, customer: customerNames[11], date: dates[9], total: 24.75 },
      { cashRegisterId: 1, customer: customerNames[12], date: dates[10], total: 47.50 },
      { cashRegisterId: 1, customer: customerNames[13], date: dates[10], total: 33.25 },
      { cashRegisterId: 1, customer: customerNames[14], date: dates[11], total: 65.75 },
      { cashRegisterId: 1, customer: customerNames[15], date: dates[11], total: 28.50 },
      { cashRegisterId: 1, customer: customerNames[16], date: dates[12], total: 51.25 },
      { cashRegisterId: 1, customer: customerNames[17], date: dates[12], total: 39.75 },
      { cashRegisterId: 1, customer: customerNames[18], date: dates[13], total: 44.00 },
      { cashRegisterId: 1, customer: customerNames[19], date: dates[13], total: 26.25 },
      { cashRegisterId: 1, customer: customerNames[0], date: dates[14], total: 58.50 },
      { cashRegisterId: 1, customer: customerNames[1], date: dates[14], total: 34.75 },
      
      // Días más recientes (últimas 2 semanas)
      { cashRegisterId: 1, customer: customerNames[2], date: dates[15], total: 72.25 },
      { cashRegisterId: 1, customer: customerNames[3], date: dates[15], total: 41.50 },
      { cashRegisterId: 1, customer: customerNames[4], date: dates[16], total: 35.75 },
      { cashRegisterId: 1, customer: customerNames[5], date: dates[16], total: 49.25 },
      { cashRegisterId: 1, customer: customerNames[6], date: dates[17], total: 56.50 },
      { cashRegisterId: 1, customer: customerNames[7], date: dates[17], total: 23.75 },
      { cashRegisterId: 1, customer: customerNames[8], date: dates[18], total: 68.00 },
      { cashRegisterId: 1, customer: customerNames[9], date: dates[18], total: 37.25 },
      { cashRegisterId: 1, customer: customerNames[10], date: dates[19], total: 52.75 },
      { cashRegisterId: 1, customer: customerNames[11], date: dates[19], total: 29.50 },
      { cashRegisterId: 1, customer: customerNames[12], date: dates[20], total: 45.25 },
      { cashRegisterId: 1, customer: customerNames[13], date: dates[20], total: 61.75 },
      
      // Última semana (actividad alta)
      { cashRegisterId: 1, customer: customerNames[14], date: dates[21], total: 83.50 },
      { cashRegisterId: 1, customer: customerNames[15], date: dates[21], total: 47.25 },
      { cashRegisterId: 1, customer: customerNames[16], date: dates[22], total: 39.75 },
      { cashRegisterId: 1, customer: customerNames[17], date: dates[22], total: 54.00 },
      { cashRegisterId: 1, customer: customerNames[18], date: dates[23], total: 66.25 },
      { cashRegisterId: 1, customer: customerNames[19], date: dates[23], total: 32.50 },
      { cashRegisterId: 1, customer: customerNames[0], date: dates[24], total: 48.75 },
      { cashRegisterId: 1, customer: customerNames[1], date: dates[24], total: 71.00 },
      { cashRegisterId: 1, customer: customerNames[2], date: dates[25], total: 43.25 },
      { cashRegisterId: 1, customer: customerNames[3], date: dates[25], total: 58.50 },
      { cashRegisterId: 1, customer: customerNames[4], date: dates[26], total: 36.75 },
      { cashRegisterId: 1, customer: customerNames[5], date: dates[26], total: 49.00 },
      
      // Últimos 3 días
      { cashRegisterId: 1, customer: customerNames[6], date: dates[27], total: 87.25 },
      { cashRegisterId: 1, customer: customerNames[7], date: dates[27], total: 52.75 },
      { cashRegisterId: 1, customer: customerNames[8], date: dates[28], total: 64.50 },
      { cashRegisterId: 1, customer: customerNames[9], date: dates[28], total: 38.25 },
      { cashRegisterId: 1, customer: customerNames[10], date: dates[29], total: 75.00 },
      { cashRegisterId: 1, customer: customerNames[11], date: dates[29], total: 41.75 },
    ];

    for (const bill of bills) {
      const exists = await billRepo.findOne({ 
        where: { 
          customer: bill.customer,
          date: bill.date,
          total: bill.total
        } 
      });
      
      if (!exists) {
        await billRepo.save(bill);
        console.log(`---SUCESS---  Bill created: ${bill.customer} - $${bill.total} on ${bill.date.toDateString()}`);
      } else {
        console.log(`---WARNING---  Bill already exists: ${bill.customer} - $${bill.total}`);
      }
    }
  }

  async revert(): Promise<void> {
    const billRepo = this.dataSource.getRepository(Bill);
    
    // Eliminar facturas de los clientes específicos que agregamos
    const customerNames = [
      "Ana García", "Carlos López", "María Rodríguez", "José Martínez", 
      "Laura Hernández", "Miguel Sánchez", "Carmen Jiménez", "Francisco Moreno",
      "Isabel Álvarez", "Antonio Ruiz", "Pilar Vega", "Manuel Torres",
      "Rosa Díaz", "Pedro Ramírez", "Lucía Flores", "Ángel Serrano",
      "Cliente Regular", "Cliente VIP", "Estudiante", "Turista"
    ];
    await billRepo.delete({ customer: customerNames as any });
    console.log("---DELETED---  All Bills seed data removed");
  }
}