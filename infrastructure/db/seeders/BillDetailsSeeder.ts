import { DataSource } from "typeorm";
import { BaseSeeder } from "./BaseSeeder";
import { BillDetails } from "../../../core/entities/BillDetails";

export class BillDetailsSeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const billDetailsRepo = this.dataSource.getRepository(BillDetails);
    
    // Simulamos productos populares con sus precios
    const productPrices = {
      1: 15.00,   // Espresso Solo
      2: 22.00,   // Espresso Doble
      3: 16.50,   // Espresso Romano
      4: 25.00,   // Cappuccino Clásico
      5: 28.00,   // Latte Tradicional
      6: 30.00,   // Flat White
      7: 20.00,   // Macchiato
      8: 35.00,   // Mocha Premium
      9: 32.00,   // Caramel Macchiato
      10: 18.00,  // Americano
      11: 30.00,  // Iced Latte
      12: 26.00,  // Cold Brew
      13: 38.00,  // Frappé Mocha
      14: 32.00,  // Té Matcha Latte
      15: 28.00,  // Chai Latte
      16: 25.00   // Chocolate Caliente Premium
    };

    const billDetails = [
      // Bill ID 1 ($45.00) - Ana García
      { billId: 1, productId: 4, quantity: 1, subTotal: 25.00 }, // Cappuccino
      { billId: 1, productId: 10, quantity: 1, subTotal: 18.00 }, // Americano
      
      // Bill ID 2 ($28.00) - Carlos López
      { billId: 2, productId: 5, quantity: 1, subTotal: 28.00 }, // Latte Tradicional
      
      // Bill ID 3 ($62.50) - María Rodríguez
      { billId: 3, productId: 8, quantity: 1, subTotal: 35.00 }, // Mocha Premium
      { billId: 3, productId: 14, quantity: 1, subTotal: 32.00 }, // Matcha Latte
      
      // Bill ID 4 ($35.00) - José Martínez
      { billId: 4, productId: 6, quantity: 1, subTotal: 30.00 }, // Flat White
      
      // Bill ID 5 ($18.00) - Laura Hernández
      { billId: 5, productId: 1, quantity: 1, subTotal: 15.00 }, // Espresso Solo
      
      // Bill ID 6 ($52.75) - Miguel Sánchez
      { billId: 6, productId: 9, quantity: 1, subTotal: 32.00 }, // Caramel Macchiato
      { billId: 6, productId: 7, quantity: 1, subTotal: 20.00 }, // Macchiato
      
      // Bill ID 7 ($25.00) - Carmen Jiménez
      { billId: 7, productId: 16, quantity: 1, subTotal: 25.00 }, // Chocolate Caliente
      
      // Bill ID 8 ($73.50) - Francisco Moreno
      { billId: 8, productId: 13, quantity: 1, subTotal: 38.00 }, // Frappé Mocha
      { billId: 8, productId: 8, quantity: 1, subTotal: 35.00 }, // Mocha Premium
      
      // Bill ID 9 ($30.00) - Isabel Álvarez
      { billId: 9, productId: 11, quantity: 1, subTotal: 30.00 }, // Iced Latte
      
      // Bill ID 10 ($41.25) - Antonio Ruiz
      { billId: 10, productId: 15, quantity: 1, subTotal: 28.00 }, // Chai Latte
      { billId: 10, productId: 1, quantity: 1, subTotal: 15.00 }, // Espresso Solo
      
      // Bill ID 11 ($56.00) - Pilar Vega
      { billId: 11, productId: 12, quantity: 2, subTotal: 52.00 }, // Cold Brew x2
      
      // Bill ID 12 ($22.50) - Manuel Torres
      { billId: 12, productId: 2, quantity: 1, subTotal: 22.00 }, // Espresso Doble
      
      // Bill ID 13 ($38.75) - Rosa Díaz
      { billId: 13, productId: 13, quantity: 1, subTotal: 38.00 }, // Frappé Mocha
      
      // Bill ID 14 ($15.00) - Pedro Ramírez
      { billId: 14, productId: 1, quantity: 1, subTotal: 15.00 }, // Espresso Solo
      
      // Bill ID 15 ($89.50) - Lucía Flores (pedido grande)
      { billId: 15, productId: 8, quantity: 1, subTotal: 35.00 }, // Mocha Premium
      { billId: 15, productId: 9, quantity: 1, subTotal: 32.00 }, // Caramel Macchiato
      { billId: 15, productId: 4, quantity: 1, subTotal: 25.00 }, // Cappuccino
      
      // Bill ID 16 ($67.25) - Ángel Serrano
      { billId: 16, productId: 6, quantity: 2, subTotal: 60.00 }, // Flat White x2
      { billId: 16, productId: 3, quantity: 1, subTotal: 16.50 }, // Espresso Romano
      
      // Bill ID 17 ($43.00) - Cliente Regular
      { billId: 17, productId: 5, quantity: 1, subTotal: 28.00 }, // Latte Tradicional
      { billId: 17, productId: 1, quantity: 1, subTotal: 15.00 }, // Espresso Solo
      
      // Bill ID 18 ($55.75) - Cliente VIP
      { billId: 18, productId: 14, quantity: 1, subTotal: 32.00 }, // Matcha Latte
      { billId: 18, productId: 15, quantity: 1, subTotal: 28.00 }, // Chai Latte
      
      // Bill ID 19 ($32.50) - Estudiante
      { billId: 19, productId: 10, quantity: 1, subTotal: 18.00 }, // Americano
      { billId: 19, productId: 4, quantity: 1, subTotal: 25.00 }, // Cappuccino
      
      // Bill ID 20 ($78.00) - Turista
      { billId: 20, productId: 13, quantity: 2, subTotal: 76.00 }, // Frappé Mocha x2
      
      // Continuar con más detalles para las demás facturas...
      // Bill ID 21 ($91.25) - Ana García (pedido especial)
      { billId: 21, productId: 8, quantity: 2, subTotal: 70.00 }, // Mocha Premium x2
      { billId: 21, productId: 7, quantity: 1, subTotal: 20.00 }, // Macchiato
      
      // Bill ID 22 ($46.50) - Carlos López
      { billId: 22, productId: 11, quantity: 1, subTotal: 30.00 }, // Iced Latte
      { billId: 22, productId: 3, quantity: 1, subTotal: 16.50 }, // Espresso Romano
      
      // Bill ID 23 ($29.75) - María Rodríguez
      { billId: 23, productId: 16, quantity: 1, subTotal: 25.00 }, // Chocolate Caliente
      
      // Bill ID 24 ($63.00) - José Martínez
      { billId: 24, productId: 9, quantity: 1, subTotal: 32.00 }, // Caramel Macchiato
      { billId: 24, productId: 6, quantity: 1, subTotal: 30.00 }, // Flat White
      
      // Agregar más detalles según sea necesario para completar todas las facturas
      // Por brevedad, incluyo algunos ejemplos más representativos
      
      // Bill ID 25 ($48.25) - Laura Hernández
      { billId: 25, productId: 12, quantity: 1, subTotal: 26.00 }, // Cold Brew
      { billId: 25, productId: 2, quantity: 1, subTotal: 22.00 }, // Espresso Doble
      
      // Bill ID 30 ($59.00) - Manuel Torres (pedido múltiple)
      { billId: 30, productId: 5, quantity: 1, subTotal: 28.00 }, // Latte Tradicional
      { billId: 30, productId: 14, quantity: 1, subTotal: 32.00 }, // Matcha Latte
      
      // Bill ID 35 ($65.75) - Lucía Flores
      { billId: 35, productId: 13, quantity: 1, subTotal: 38.00 }, // Frappé Mocha
      { billId: 35, productId: 15, quantity: 1, subTotal: 28.00 }, // Chai Latte
      
      // Últimas facturas de actividad reciente
      // Bill ID 60 ($75.00) - Cliente VIP (penúltima factura)
      { billId: 60, productId: 8, quantity: 1, subTotal: 35.00 }, // Mocha Premium
      { billId: 60, productId: 6, quantity: 1, subTotal: 30.00 }, // Flat White
      { billId: 60, productId: 10, quantity: 1, subTotal: 18.00 }, // Americano
      
      // Bill ID 61 ($41.75) - Última factura
      { billId: 61, productId: 9, quantity: 1, subTotal: 32.00 }, // Caramel Macchiato
      { billId: 61, productId: 1, quantity: 1, subTotal: 15.00 }, // Espresso Solo
    ];

    for (const detail of billDetails) {
      const exists = await billDetailsRepo.findOne({ 
        where: { 
          billId: detail.billId,
          productId: detail.productId
        } 
      });
      
      if (!exists) {
        await billDetailsRepo.save(detail);
        console.log(`---SUCESS--- Bill Detail created: Bill ${detail.billId} - Product ${detail.productId} (Qty: ${detail.quantity}, SubTotal: $${detail.subTotal})`);
      } else {
        console.log(`---WARNING--- Bill Detail already exists: Bill ${detail.billId} - Product ${detail.productId}`);
      }
    }
  }

  async revert(): Promise<void> {
    const billDetailsRepo = this.dataSource.getRepository(BillDetails);
    
    // Delete all bill details using remove method
    const allBillDetails = await billDetailsRepo.find();
    if (allBillDetails.length > 0) {
      await billDetailsRepo.remove(allBillDetails);
    }
    console.log("---DELETED--- All Bill Details seed data removed");
  }
}