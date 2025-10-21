import { Repository } from "typeorm";
import { Ingredient } from "../../core/entities/Ingredient";
import { IService } from "../../core/interfaces/IService";
import { SaveIngredientDTO, UpdateIngredientDTO } from "../DTOs/IngredientDTOs";

export class IngredientService implements IService {
  constructor(private ingredientRepo: Repository<Ingredient>) {
    this.ingredientRepo = ingredientRepo;
  }

  async saveAll(body: SaveIngredientDTO[]): Promise<Ingredient[]> {
    const ingredients = body.map(data => {
      const ingredient = new Ingredient();
      ingredient.name = data.name;
      ingredient.quantity = data.quantity;
      ingredient.productId = data.productId;
      ingredient.consumableId = data.consumableId;
      return ingredient;
    });

    return await this.ingredientRepo.save(ingredients);
  }

  async save(body: SaveIngredientDTO): Promise<Ingredient> {
    const ingredient = new Ingredient();
    ingredient.name = body.name;
    ingredient.quantity = body.quantity;
    ingredient.productId = body.productId;
    ingredient.consumableId = body.consumableId;
    
    console.log("Guardando ingrediente...");
    console.log(ingredient)
    return await this.ingredientRepo.save(ingredient);
  }

  async delete(id: number): Promise<any> {
    const result = await this.ingredientRepo.delete(id);
    if (result.affected === 0) {
      throw new Error(`Ingrediente con ID ${id} no encontrado`);
    }
    return { message: "Ingrediente eliminado correctamente", id };
  }

  async update(body: UpdateIngredientDTO): Promise<Ingredient> {
    const { ingredientId, ...updateData } = body;

    if (!ingredientId) {
      throw new Error("ingredientId es requerido para actualizar");
    }

    const ingredient = await this.ingredientRepo.findOne({ 
      where: { ingredientId } 
    });
    
    if (!ingredient) {
      throw new Error(`Ingrediente con ID ${ingredientId} no encontrado`);
    }

    if (updateData.name !== undefined) ingredient.name = updateData.name;
    if (updateData.quantity !== undefined) ingredient.quantity = updateData.quantity;
    if (updateData.productId !== undefined) ingredient.productId = updateData.productId;
    if (updateData.consumableId !== undefined) ingredient.consumableId = updateData.consumableId;

    return await this.ingredientRepo.save(ingredient);
  }

  async getAll(): Promise<Ingredient[]> {
    console.log("Obteniendo ingredientes...");
    return await this.ingredientRepo.find({ 
      relations: ["product", "consumable"],
      order: { name: "ASC" }
    });
  }

  async getById(id: number): Promise<Ingredient> {
    const ingredient = await this.ingredientRepo.findOne({ 
      where: { ingredientId: id },
      relations: ["product", "consumable"]
    });
    
    if (!ingredient) {
      throw new Error(`Ingrediente con ID ${id} no encontrado`);
    }
    
    return ingredient;
  }

  async getByProduct(productId: number): Promise<Ingredient[]> {
    return await this.ingredientRepo.find({
      where: { productId },
      relations: ["product", "consumable"],
      order: { name: "ASC" }
    });
  }

  async getByConsumable(consumableId: number): Promise<Ingredient[]> {
    return await this.ingredientRepo.find({
      where: { consumableId },
      relations: ["product", "consumable"],
      order: { name: "ASC" }
    });
  }

  async getIngredientsByProductAndConsumable(productId: number, consumableId: number): Promise<Ingredient[]> {
    return await this.ingredientRepo.find({
      where: { 
        productId,
        consumableId 
      },
      relations: ["product", "consumable"],
      order: { name: "ASC" }
    });
  }


}
