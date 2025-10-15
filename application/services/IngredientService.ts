import { Repository } from "typeorm";
import { Ingredient } from "../../core/entities/Ingredient";
import { IService } from "../../core/interfaces/IService";
import { SaveIngredientDTO } from "../DTOs/IngredientDTOs";

export class IngredientService implements IService {
  constructor(private ingredientRepo: Repository<Ingredient>) {
    this.ingredientRepo = ingredientRepo;
  }
  save(body: SaveIngredientDTO): Promise<any> {
    const ingredient = new Ingredient();
    ingredient.name = body.name;
    ingredient.quantity = body.quantity;
    ingredient.productId = body.productId;
    ingredient.consumableId = body.consumableId;
    console.log("Guardando ingrediente...");
    return this.ingredientRepo.save(ingredient);
  }
  saveAll(body: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  delete(id: number): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update(body: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<any[]> {
    console.log("Obteniendo ingredientes...");
    return this.ingredientRepo.find({ relations: ["product", "consumable"] });
  }
}
