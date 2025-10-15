import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Consumable } from "./Consumable";

@Entity("consumable_type")
export class ConsumableType{

    @PrimaryGeneratedColumn('increment',{name:"consumable_type_id"})
    consumableTypeId:number = 0;
    @Column()
    name:string ='';

    @OneToMany(()=> Consumable, (consumable:Consumable) => consumable.consumableType)
    consumable!:Consumable;

    constructor(){}
}