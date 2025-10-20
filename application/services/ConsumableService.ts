import { Repository } from "typeorm";
import { Consumable } from "../../core/entities/Consumable";
import { IService } from "../../core/interfaces/IService";
import { SaveConsumableDTO, UpdateConsumableDTO } from "../DTOs/ConsumableDTO";

export class ConsumableService implements IService {
  constructor(private consumableRepository: Repository<Consumable>) {
    this.consumableRepository = consumableRepository;
  }

  async save(body: SaveConsumableDTO): Promise<Consumable> {
    const consumable = new Consumable();
    consumable.supplierId = body.supplier;
    consumable.name = body.name;
    consumable.cosumableTypeId = body.TypeId;
    consumable.cost = body.cost;
    consumable.quantity = body.quantity;
    consumable.unitMeasurement = body.unitMeasurement;
    
    return await this.consumableRepository.save(consumable);
  }

  async saveAll(consumables: SaveConsumableDTO[]): Promise<Consumable[]> {
    const consumableEntities = consumables.map(body => {
      const consumable = new Consumable();
      consumable.supplierId = body.supplier;
      consumable.name = body.name;
      consumable.cosumableTypeId = body.TypeId;
      consumable.cost = body.cost;
      consumable.quantity = body.quantity;
      consumable.unitMeasurement = body.unitMeasurement;
      return consumable;
    });
    
    return await this.consumableRepository.save(consumableEntities);
  }

  async delete(id: number): Promise<any> {
    const result = await this.consumableRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Consumible con ID ${id} no encontrado`);
    }
    return { message: "Consumible eliminado correctamente", id };
  }

  async update(body: UpdateConsumableDTO): Promise<Consumable> {
    const { consumableId, ...updateData } = body;

    if (!consumableId) {
      throw new Error("consumableId es requerido para actualizar");
    }

    const consumable = await this.consumableRepository.findOne({ 
      where: { consumableId } 
    });
    
    if (!consumable) {
      throw new Error(`Consumible con ID ${consumableId} no encontrado`);
    }

    if (updateData.supplier !== undefined) consumable.supplierId = updateData.supplier;
    if (updateData.name !== undefined) consumable.name = updateData.name;
    if (updateData.TypeId !== undefined) consumable.cosumableTypeId = updateData.TypeId;
    if (updateData.cost !== undefined) consumable.cost = updateData.cost;
    if (updateData.quantity !== undefined) consumable.quantity = updateData.quantity;
    if (updateData.unitMeasurement !== undefined) consumable.unitMeasurement = updateData.unitMeasurement;

    return await this.consumableRepository.save(consumable);
  }

  async getAll(): Promise<Consumable[]> {
    return await this.consumableRepository.find({
      relations: ['consumableType', 'supplier'],
      order: { name: "ASC" }
    });
  }

  async getById(id: number): Promise<Consumable> {
    const consumable = await this.consumableRepository.findOne({
      where: { consumableId: id },
      relations: ['consumableType', 'supplier']
    });

    if (!consumable) {
      throw new Error(`Consumible con ID ${id} no encontrado`);
    }

    return consumable;
  }

  async getBySupplier(supplierId: number): Promise<Consumable[]> {
    return await this.consumableRepository.find({
      where: { supplierId },
      relations: ['consumableType', 'supplier'],
      order: { name: "ASC" }
    });
  }

  async getByConsumableType(consumableTypeId: number): Promise<Consumable[]> {
    return await this.consumableRepository.find({
      where: { cosumableTypeId: consumableTypeId },
      relations: ['consumableType', 'supplier'],
      order: { name: "ASC" }
    });
  }

  async getLowStockConsumables(threshold: number = 10): Promise<Consumable[]> {
    return await this.consumableRepository
      .createQueryBuilder("consumable")
      .leftJoinAndSelect("consumable.consumableType", "consumableType")
      .leftJoinAndSelect("consumable.supplier", "supplier")
      .where("consumable.quantity <= :threshold", { threshold })
      .orderBy("consumable.quantity", "ASC")
      .getMany();
  }
}
