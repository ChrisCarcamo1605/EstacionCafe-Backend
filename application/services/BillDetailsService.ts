import { Repository } from "typeorm";
import { IService } from "../../core/interfaces/IService";
import { BillDetails } from "../../core/entities/BillDetails";
import { Product } from "../../core/entities/Producto";
import { SaveBillDetailDTO } from "../DTOs/BillsDTO";
import { log } from "console";

export class BillDetailsService implements IService {
  constructor(
    private detailRepo: Repository<BillDetails>,
    private billService: IService,
  ) {
    this.detailRepo = detailRepo;
    this.billService = billService;
  }
  async getById(id: number): Promise<BillDetails[]> {
    console.log(`Obteniendo detalles de la factura ${id}...`);
    return this.detailRepo.find({
      where: { billId: id },
      relations: ["product", "bill"],
    });
  }

  save(_body: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async saveAll(body: SaveBillDetailDTO): Promise<any> {
    const data: SaveBillDetailDTO = body;
    const bill = await this.billService.getById(data.billId);
    if (!bill) {
      throw new Error(`Bill con ID ${data.billId} no encontrado`);
    }
    const existingDetails = await this.detailRepo.find({
      where: { billId: data.billId },
    });

    const detailsToSave: BillDetails[] = [];
    const productRepo = this.detailRepo.manager.getRepository(Product);

    for (const item of data.billDetails) {
      // Validar que el producto existe por ID
      const product = await productRepo.findOne({
        where: { productId: item.productId },
      });

      if (!product) {
        throw new Error(`Producto con ID ${item.productId} no encontrado`);
      }

      if (product.name !== item.name) {
        throw new Error(
          `El nombre del producto no coincide: esperado "${product.name}", recibido "${item.name}"`,
        );
      }

      if (Math.abs(product.price - item.price) > 0.01) {
        throw new Error(
          `El precio del producto "${item.name}" no coincide: esperado ${product.price}, recibido ${item.price}`,
        );
      }

      const expectedSubTotal = item.quantity * item.price;
      if (Math.abs(expectedSubTotal - item.subTotal) > 0.01) {
        throw new Error(
          `El subtotal del producto "${item.name}" no es correcto: esperado ${expectedSubTotal}, recibido ${item.subTotal}`,
        );
      }

      // Verificar si ya existe un detalle con este producto
      const existingDetail = existingDetails.find(
        (detail) => detail.productId === item.productId,
      );

      if (existingDetail) {
        // Actualizar cantidad sumando la nueva cantidad
        existingDetail.quantity = item.quantity;
        existingDetail.subTotal = existingDetail.quantity * item.price;
        detailsToSave.push(existingDetail);
        console.log(
          `Actualizando detalle existente para producto ${item.productId}: nueva cantidad ${existingDetail.quantity}`,
        );
      } else {
        // Crear nuevo detalle
        const newDetail = new BillDetails();
        newDetail.billId = data.billId;
        newDetail.productId = item.productId;
        newDetail.quantity = item.quantity;
        newDetail.subTotal = item.subTotal;
        detailsToSave.push(newDetail);
        console.log(`Creando nuevo detalle para producto ${item.productId}`);
      }
    }

    // Guardar todos los detalles (nuevos y actualizados)
    let savedDetails;
    try {
      savedDetails = await this.detailRepo.save(detailsToSave);
    } catch (dbError: any) {
      // Capturar errores del trigger de la base de datos
      if (dbError.message && dbError.message.includes("Stock insuficiente")) {
        // Propagar el error del trigger tal cual
        throw new Error(dbError.message);
      }
      // Propagar otros errores de base de datos
      throw dbError;
    }

    // Calcular el total de TODOS los detalles de la factura
    const allDetails = await this.detailRepo.find({
      where: { billId: data.billId },
    });

    const newTotal = allDetails.reduce(
      (acc, detail) => acc + detail.subTotal,
      0,
    );

    await this.billService.update({
      billId: data.billId,
      total: newTotal,
    });

    console.log(
      `Guardados/actualizados ${savedDetails.length} detalles y actualizado total a ${newTotal}`,
    );
    return savedDetails;
  }
  async delete(id: number): Promise<any> {
    const result = await this.detailRepo.delete(id);
    if (result.affected === 0) {
      throw new Error(`Detalle con ID ${id} no encontrado`);
    }
    return { message: "Detalle eliminado correctamente", id };
  }
  update(_body: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<any[]> {
    console.log(`Obteniendo bills details...`);

    return this.detailRepo.find({
      relations: ["product", "bill"],
    });
  }
}
