import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BillDetails } from "./BillDetails";

@Entity("bills")
export class Bill {
  @PrimaryGeneratedColumn("increment",{ name: "bill_id" })
  billId?: number = undefined;

  @Column({name:"cash_register"})
  cashRegister?: number = undefined;
  @Column()
  customer: string = "";
  @Column()
  date: Date = new Date();
  @Column("decimal", { name: "total", precision: 10, scale: 2 })
  total: number = 0;

  @OneToMany(() => BillDetails, (billDet:BillDetails) => billDet.bill)
  billDetails!: BillDetails[];
}
