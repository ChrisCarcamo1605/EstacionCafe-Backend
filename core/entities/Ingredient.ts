export class Ingredient {
  ingredientId: bigint;
  consumibleId: bigint;
  name: string;
  quantity: number;
  productId: bigint;

  constructor(
    ingredientId: bigint,
    consumibleId: bigint,
    name: string,
    quantity: number,
    productId: bigint
  ) {
    this.consumibleId = consumibleId;
    this.productId = productId;
    this.name = name;
    this.ingredientId = ingredientId;
    this.quantity = quantity;
  }
}
