import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("suppliers")
export class Supplier {
    @PrimaryGeneratedColumn("increment", { name: "supplier_id" })
    supplierId?: number = undefined;

    @Column({ length: 100 })
    name: string = "";

    @Column({ length: 20 })
    phone: string = "";

    @Column({ length: 100 })
    email: string = "";

    @Column({ default: true })
    active: boolean = true;
}