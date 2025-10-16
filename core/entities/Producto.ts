import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BillDetails } from "./BillDetails";
import { Ingredient } from "./Ingredient";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn({name:"product_id"})
  productId: number = 0;

  @Column()
  name: string = "";
  @Column()
  description: string = "";
  @Column("decimal", { precision: 10, scale: 2 })
  price: number = 0.0;
  @Column("decimal", { precision: 10, scale: 2 })
  cost: number = 0.0;
  @Column()
  active: boolean = true;

  @OneToMany(() => BillDetails, (billDetail: BillDetails) => billDetail.product)
  billDetails!: BillDetails[];
  @OneToMany(() => Ingredient, (ingredient) => ingredient.product)
  ingredients!: Ingredient[];
  constructor() {}
}
