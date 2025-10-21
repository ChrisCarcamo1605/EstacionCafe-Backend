import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BillDetails } from "./BillDetails";
import { CashRegister } from "./CashRegister";

@Entity("bills")
export class Bill {
  @PrimaryGeneratedColumn("increment", { name: "bill_id" })
  billId?: number = undefined;

  @Column({ name: "cash_register" })
  cashRegisterId!: number;
  @Column()
  customer: string = "";
  @Column()
  date: Date = new Date();
  @Column("decimal", { name: "total", precision: 10, scale: 2 })
  total!: number;

  @OneToMany(() => BillDetails, (billDet: BillDetails) => billDet.bill)
  billDetails!: BillDetails[];

  @JoinColumn({name:"cash_register"})
  @ManyToOne(
    () => CashRegister,
    (cashRegister: CashRegister) => cashRegister.bill
  )
  cashRegister!: CashRegister;
}
