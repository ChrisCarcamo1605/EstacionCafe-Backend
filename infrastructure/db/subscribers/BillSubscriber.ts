import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from "typeorm";
import { Bill } from "../../../core/entities/Bill";
import { Table, TableStatus } from "../../../core/entities/Table";
import { Status } from "../../../core/enums/Status";

@EventSubscriber()
export default class BillSubscriber implements EntitySubscriberInterface<Bill> {
  listenTo() {
    return Bill;
  }

  // After a bill is inserted: if it's OPEN and connected to a table => mark table as OCUPADA
  async afterInsert(event: InsertEvent<Bill>) {
    const bill = event.entity;
    if (!bill) return;

    try {
      if (bill.tableId && bill.status === Status.OPEN) {
        await event.manager.update(
          Table,
          { tableId: bill.tableId },
          { status: TableStatus.OCUPADA },
        );
      }
    } catch (err) {
      // Avoid throwing in subscriber to not break original operation; log and continue
      console.error("BillSubscriber.afterInsert error:", err);
    }
  }

  // After a bill is updated: react to status changes
  async afterUpdate(event: UpdateEvent<Bill>) {
    const bill = event.entity as Bill | undefined;
    const dbBill = event.databaseEntity as Bill | undefined;

    try {
      // If bill became OPEN (was not OPEN before) and has a table => mark table occupied
      if (
        bill &&
        bill.status === Status.OPEN &&
        dbBill?.status !== Status.OPEN &&
        bill.tableId
      ) {
        await event.manager.update(
          Table,
          { tableId: bill.tableId },
          { status: TableStatus.OCUPADA },
        );
        return;
      }

      // If bill was OPEN and now is not OPEN, check if the table has any remaining OPEN bills
      // Use the tableId from dbBill (previous state) or current bill
      const tableId = (dbBill && dbBill.tableId) || bill?.tableId;
      if (!tableId) return;

      // Count open bills for this table
      const openCount = await event.manager.count(Bill, {
        where: { tableId, status: Status.OPEN },
      });

      if (openCount === 0) {
        // No more open bills for that table: mark table as available and clear bills relation
        await event.manager.update(
          Table,
          { tableId },
          { status: TableStatus.DISPONIBLE },
        );

        // Clear table association from bills that belong to this table (so the table 'cleans' its bills)
        await event.manager
          .createQueryBuilder()
          .update(Bill)
          .set({ tableId: null })
          .where("table_id = :tableId", { tableId })
          .execute();
      }
    } catch (err) {
      console.error("BillSubscriber.afterUpdate error:", err);
    }
  }
}
