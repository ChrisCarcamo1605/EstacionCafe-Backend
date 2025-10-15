export interface SaveIngredientDTO {
  name: string;
  quantity: number;
  productId: number;
  consumableId: number;
}

export interface ResponseIngredientDTO {
  ingredientId: number;
  name: string;
  quantity: number;
  productId: number;
  consumableId: number;
  
}
