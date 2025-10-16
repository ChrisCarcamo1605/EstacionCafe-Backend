import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ConsumableType } from "./ConsumableType";
import { UnitMeasurement } from "../enums/UnitMeasurement";
import { Ingredient } from "./Ingredient";

@Entity("Consumable")
export class Consumable {
  @PrimaryGeneratedColumn("increment", { name: "consumable_id" })
  consumableId!: number;
  @Column({ name: "supplier_id" })
  supplierId!: number;
  @Column()
  name: string = "";
  @Column({ name: "consumable_type_id" })
  cosumableTypeId: number = 0;

  @ManyToOne(() => ConsumableType, (type: ConsumableType) => type)
  @JoinColumn({ name: "consumable_type_id" })
  consumableType?: ConsumableType;
  @Column("float")
  quantity: number = 0;
  @Column()
  unitMeasurement!: UnitMeasurement;
  @Column("numeric", { precision: 10, scale: 2 })
  cost: number = 0;

  @OneToMany(() => Ingredient, (ingredient) => ingredient.consumable)
  ingredients!: Ingredient[];

  constructor() {}
}
