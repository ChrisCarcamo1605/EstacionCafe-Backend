import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("cash_registers")
export class CashRegister {
    @PrimaryGeneratedColumn("increment", { name: "cash_register_id" })
    cashRegisterId?: number = undefined;

    @Column({ length: 50 })
    number: string = "";

    @Column({ default: true })
    active: boolean = true;
}