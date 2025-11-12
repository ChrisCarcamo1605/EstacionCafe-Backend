import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BillDetails } from "./BillDetails";
import { User } from "./User";
import { Status } from "../enums/Status";

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

  @Column({ default: Status.CLOSED })
  status!: Status;

  @OneToMany(() => BillDetails, (billDet: BillDetails) => billDet.bill)
  billDetails!: BillDetails[];

  @JoinColumn({ name: "cash_register" })
  @ManyToOne(() => User, (cashRegister: User) => cashRegister.bill)
  cashRegister!: User;
}
