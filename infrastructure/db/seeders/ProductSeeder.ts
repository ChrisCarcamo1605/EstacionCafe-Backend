import { DataSource, In } from "typeorm";
import { BaseSeeder } from "./BaseSeeder";
import { Product } from "../../../core/entities/Producto";
import { ProductType } from "../../../core/entities/ProductType";

export class ProductSeeder extends BaseSeeder {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async run(): Promise<void> {
    const productRepo = this.dataSource.getRepository(Product);
    const productTypeRepo = this.dataSource.getRepository(ProductType);

    // Obtener IDs de tipos de producto
    const bebidasCalientesType = await productTypeRepo.findOne({
      where: { name: "Bebidas Calientes" },
    });
    const bebidasFriasType = await productTypeRepo.findOne({
      where: { name: "Bebidas Frías" },
    });
    const bebidasSinCafeinaType = await productTypeRepo.findOne({
      where: { name: "Bebidas sin Cafeína" },
    });

    if (!bebidasCalientesType || !bebidasFriasType || !bebidasSinCafeinaType) {
      throw new Error(
        "Los tipos de producto deben existir antes de crear productos. Ejecuta ProductTypeSeeder primero.",
      );
    }

    const products = [
      // Cafés Espresso - Bebidas Calientes
      {
        name: "Espresso Solo",
        description:
          "Café espresso clásico, intenso y aromático servido en taza pequeña",
        price: 15.0,
        cost: 6.5,
        active: true,
        productTypeId: bebidasCalientesType.productTypeId,
      },
      {
        name: "Espresso Doble",
        description: "Doble shot de espresso para los amantes del café fuerte",
        price: 22.0,
        cost: 9.5,
        active: true,
        productTypeId: bebidasCalientesType.productTypeId,
      },
      {
        name: "Espresso Romano",
        description: "Espresso tradicional con una rodaja de limón",
        price: 16.5,
        cost: 7.0,
        active: true,
        productTypeId: bebidasCalientesType.productTypeId,
      },

      // Cafés con Leche - Bebidas Calientes
      {
        name: "Cappuccino Clásico",
        description: "Espresso con leche vaporizada y espuma cremosa",
        price: 25.0,
        cost: 12.0,
        active: true,
        productTypeId: bebidasCalientesType.productTypeId,
      },
      {
        name: "Latte Tradicional",
        description: "Café espresso con abundante leche vaporizada",
        price: 28.0,
        cost: 14.5,
        active: true,
        productTypeId: bebidasCalientesType.productTypeId,
      },
      {
        name: "Flat White",
        description:
          "Espresso doble con leche microespumada al estilo australiano",
        price: 30.0,
        cost: 15.5,
        active: true,
        productTypeId: bebidasCalientesType.productTypeId,
      },
      {
        name: "Macchiato",
        description: "Espresso 'manchado' con una cucharada de leche espumada",
        price: 20.0,
        cost: 9.0,
        active: true,
        productTypeId: bebidasCalientesType.productTypeId,
      },

      // Cafés Especiales - Bebidas Calientes
      {
        name: "Mocha Premium",
        description: "Espresso con chocolate premium y leche vaporizada",
        price: 35.0,
        cost: 18.0,
        active: true,
        productTypeId: bebidasCalientesType.productTypeId,
      },
      {
        name: "Caramel Macchiato",
        description: "Latte con sirope de caramelo y espuma de leche",
        price: 32.0,
        cost: 16.5,
        active: true,
        productTypeId: bebidasCalientesType.productTypeId,
      },
      {
        name: "Americano",
        description: "Espresso diluido con agua caliente al estilo americano",
        price: 18.0,
        cost: 8.5,
        active: true,
        productTypeId: bebidasCalientesType.productTypeId,
      },

      // Cafés Fríos - Bebidas Frías
      {
        name: "Iced Latte",
        description: "Latte servido con hielo, perfecto para días calurosos",
        price: 30.0,
        cost: 15.0,
        active: true,
        productTypeId: bebidasFriasType.productTypeId,
      },
      {
        name: "Cold Brew",
        description:
          "Café extraído en frío durante 12 horas, suave y aromático",
        price: 26.0,
        cost: 12.5,
        active: true,
        productTypeId: bebidasFriasType.productTypeId,
      },
      {
        name: "Frappé Mocha",
        description: "Bebida helada con café, chocolate y crema batida",
        price: 38.0,
        cost: 20.0,
        active: true,
        productTypeId: bebidasFriasType.productTypeId,
      },

      // Tés y Otras Bebidas - Bebidas sin Cafeína
      {
        name: "Té Matcha Latte",
        description: "Té verde matcha japonés con leche vaporizada",
        price: 32.0,
        cost: 16.0,
        active: true,
        productTypeId: bebidasSinCafeinaType.productTypeId,
      },
      {
        name: "Chai Latte",
        description: "Té especiado indio con leche y canela",
        price: 28.0,
        cost: 14.0,
        active: true,
        productTypeId: bebidasSinCafeinaType.productTypeId,
      },
      {
        name: "Chocolate Caliente Premium",
        description: "Chocolate belga con leche y marshmallows",
        price: 25.0,
        cost: 13.0,
        active: true,
        productTypeId: bebidasSinCafeinaType.productTypeId,
      },
    ];

    for (const product of products) {
      const exists = await productRepo.findOne({
        where: { name: product.name },
      });

      if (!exists) {
        await productRepo.save(product);
        console.log(
          `---SUCESS--- Product created: ${product.name} ($${product.price})`,
        );
      } else {
        console.log(`---WARNING--- Product already exists: ${product.name}`);
      }
    }
  }

  async revert(): Promise<void> {
    const productRepo = this.dataSource.getRepository(Product);

    // Eliminar productos específicos que agregamos
    const productNames = [
      "Espresso Solo",
      "Espresso Doble",
      "Espresso Romano",
      "Cappuccino Clásico",
      "Latte Tradicional",
      "Flat White",
      "Macchiato",
      "Mocha Premium",
      "Caramel Macchiato",
      "Americano",
      "Iced Latte",
      "Cold Brew",
      "Frappé Mocha",
      "Té Matcha Latte",
      "Chai Latte",
      "Chocolate Caliente Premium",
    ];
    await productRepo.delete({ name: In(productNames) });
    console.log("---DELETED--- All Products seed data removed");
  }
}
