import { Repository } from "typeorm";
import { Product } from "../../core/entities/Producto";
import { IService } from "../../core/interfaces/IService";

export class ProductService implements IService {
  constructor(private productRepository: Repository<Product>) {
    this.productRepository = productRepository;
  }
  async getById(id: number): Promise<any | null> {
    console.log(`Obteniendo factura con ID: ${id}`);
    return await this.productRepository.findOne({ where: { productId: id } });
  }
  saveAll(body: any[]): Promise<any[]> {
    throw new Error("Method not implemented.");
  }

  save(body: any): Promise<any> {
    const data = body;
    const prod = new Product();
    prod.productId = data.productId;
    prod.name = data.name;
    prod.description = data.description;
    prod.price = data.price;
    prod.cost = data.cost;

    console.log("Guardando producto...");
    return this.productRepository.save(prod);
  }
  delete(id: number): Promise<any> {
    return this.productRepository.delete(id);
  }
  update(body: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<any[]> {
    console.log(`Obteniendo productos...`);
    return this.productRepository.find();
  }
}
