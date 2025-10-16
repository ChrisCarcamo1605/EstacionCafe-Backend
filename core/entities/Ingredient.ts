import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Producto";
import { Consumable } from "./Consumable";

@Entity("ingredients")
export class Ingredient {
  @PrimaryGeneratedColumn("increment", { name: "ingredient_id" })
  ingredientId: number = 0;

  @Column({ name: "consumible_id" })
  consumableId: number = 0;

  @Column()
  name: string = "";

  @Column("decimal", { precision: 10, scale: 2 })
  quantity: number = 0;

  @Column({ name: "product_id" })
  productId: number = 0;

  @ManyToOne(() => Consumable, (consumable) => consumable.ingredients)
  @JoinColumn({ name: "consumible_id" })
  consumable?: Consumable;

  @ManyToOne(() => Product, (product) => product.ingredients)
  @JoinColumn({ name: "product_id" })
  product?: Product;

  constructor() {}
}
