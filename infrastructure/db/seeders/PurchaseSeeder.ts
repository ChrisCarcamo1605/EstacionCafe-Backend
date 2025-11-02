import { DataSource, In } from "typeorm";
import { BaseSeeder } from "./BaseSeeder";
import { Purchase } from "../../../core/entities/Purchase";

export class PurchaseSeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const purchaseRepo = this.dataSource.getRepository(Purchase);

    // Fechas de los últimos 6 meses para simular historial
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const purchases = [
      // Compras de Café Premium (Proveedor 1)
      { date: sixMonthsAgo, cashRegister: 1, supplierId: 1, total: 1425.0 }, // Café Arábica + Espresso Blend
      { date: fourMonthsAgo, cashRegister: 1, supplierId: 1, total: 880.0 }, // Restock café robusta
      { date: twoMonthsAgo, cashRegister: 1, supplierId: 1, total: 1650.0 }, // Gran pedido de café
      { date: oneWeekAgo, cashRegister: 1, supplierId: 1, total: 950.0 }, // Restock reciente

      // Compras de Café Orgánico (Proveedor 2)
      { date: sixMonthsAgo, cashRegister: 1, supplierId: 2, total: 893.75 }, // Café orgánico + House Blend
      { date: twoMonthsAgo, cashRegister: 1, supplierId: 2, total: 1192.5 }, // Pedido especial orgánico

      // Compras de Lácteos (Proveedor 3)
      { date: sixMonthsAgo, cashRegister: 1, supplierId: 3, total: 295.0 }, // Leche entera y descremada
      { date: fourMonthsAgo, cashRegister: 1, supplierId: 3, total: 172.0 }, // Restock leche
      { date: twoMonthsAgo, cashRegister: 1, supplierId: 3, total: 335.5 }, // Pedido grande lácteos
      { date: oneMonthAgo, cashRegister: 1, supplierId: 3, total: 258.75 }, // Pedido regular
      { date: twoWeeksAgo, cashRegister: 1, supplierId: 3, total: 189.25 }, // Restock quincenal
      { date: oneWeekAgo, cashRegister: 1, supplierId: 3, total: 215.5 }, // Pedido semanal

      // Compras de Chocolate (Proveedor 4)
      { date: sixMonthsAgo, cashRegister: 1, supplierId: 4, total: 747.0 }, // Chocolate premium + cacao
      { date: twoMonthsAgo, cashRegister: 1, supplierId: 4, total: 496.0 }, // Restock chocolate

      // Compras de Té (Proveedor 5)
      { date: fourMonthsAgo, cashRegister: 1, supplierId: 5, total: 618.0 }, // Matcha + Earl Grey + Manzanilla
      { date: oneMonthAgo, cashRegister: 1, supplierId: 5, total: 325.0 }, // Restock tés

      // Compras de Azúcar (Proveedor 6)
      { date: sixMonthsAgo, cashRegister: 1, supplierId: 6, total: 377.5 }, // Azúcar refinada + morena + stevia
      { date: twoMonthsAgo, cashRegister: 1, supplierId: 6, total: 292.5 }, // Restock endulzantes

      // Compras de Vasos (Proveedor 7)
      { date: fourMonthsAgo, cashRegister: 1, supplierId: 7, total: 645.0 }, // Vasos de todos los tamaños
      { date: oneMonthAgo, cashRegister: 1, supplierId: 7, total: 425.0 }, // Restock vasos populares

      // Compras de Especias (Proveedor 8)
      { date: sixMonthsAgo, cashRegister: 1, supplierId: 8, total: 131.5 }, // Canela + vainilla

      // Compras de Siropes (Proveedor 9)
      { date: fourMonthsAgo, cashRegister: 1, supplierId: 9, total: 280.0 }, // Todos los siropes
      { date: twoWeeksAgo, cashRegister: 1, supplierId: 9, total: 186.0 }, // Restock siropes populares

      // Compras de Alternativas Lácteas (Proveedor 10)
      { date: twoMonthsAgo, cashRegister: 1, supplierId: 10, total: 306.25 }, // Leche almendras + avena
      { date: oneWeekAgo, cashRegister: 1, supplierId: 10, total: 157.5 }, // Restock alternativas
    ];

    for (const purchase of purchases) {
      const exists = await purchaseRepo.findOne({
        where: {
          date: purchase.date,
          supplierId: purchase.supplierId,
          total: purchase.total,
        },
      });

      if (!exists) {
        await purchaseRepo.save(purchase);
        console.log(
          `---COMPLETED--- Purchase created: $${purchase.total} from Supplier ${purchase.supplierId} on ${purchase.date.toDateString()}`,
        );
      } else {
        console.log(
          `---WARNING--- Purchase already exists: $${purchase.total} from Supplier ${purchase.supplierId}`,
        );
      }
    }
  }

  async revert(): Promise<void> {
    const purchaseRepo = this.dataSource.getRepository(Purchase);

    // Eliminar compras de los proveedores específicos que agregamos
    const supplierIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    await purchaseRepo.delete({ supplierId: In(supplierIds) });
    console.log("---DELETED--- All Purchases seed data removed");
  }
}
