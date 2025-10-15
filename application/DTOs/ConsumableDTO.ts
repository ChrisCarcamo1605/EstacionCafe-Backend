import { UnitMeasurement } from "../../core/enums/UnitMeasurement";

export interface SaveConsumableDTO {
  supplier: number;
  name: string;
  TypeId: number;
  quantity: number;
  unitMeasurement: UnitMeasurement;
  cost: number;
}

export interface UpdateConsumableDTO {
  consumableId: number;
  supplier: number;
  name: string;
  TypeId: number;
  quantity: number;
  unitMeasurement: UnitMeasurement;
  cost: number;
}

export interface SaveConsumableTypeDTO {
    name:string;

}

export interface UpdateConsumableTypeDTO {
    consumableTypeId:number;
    name:string;
}