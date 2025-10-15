import { Repository } from "typeorm";
import { Consumable } from "../../core/entities/Consumable";
import { IService } from "../../core/interfaces/IService";
import { SaveConsumableDTO } from "../DTOs/ConsumableDTO";

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

  async delete(id: number): Promise<void> {
    const result = await this.consumableRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Consumible con ID ${id} no encontrado`);
    }
  }

  async update(body:Partial<SaveConsumableDTO>): Promise<Consumable> {
    const consumable = await this.consumableRepository.findOne({ 
      where: { consumableId: body.TypeId } 
    });
    
    if (!consumable) {
      throw new Error(`Consumible con ID ${body.TypeId} no encontrado`);
    }

    if (body.supplier !== undefined) consumable.supplierId = body.supplier;
    if (body.name !== undefined) consumable.name = body.name;
    if (body.TypeId !== undefined) consumable.cosumableTypeId = body.TypeId;
    if (body.cost !== undefined) consumable.cost = body.cost;
    if (body.quantity !== undefined) consumable.quantity = body.quantity;
    if (body.unitMeasurement !== undefined) consumable.unitMeasurement = body.unitMeasurement;

    return await this.consumableRepository.save(consumable);
  }

  async getAll(): Promise<Consumable[]> {
    return await this.consumableRepository.find({
      relations: ['consumableType']
    });
  }

  async getById(id: number): Promise<Consumable | null> {
    return await this.consumableRepository.findOne({
      where: { consumableId: id },
      relations: ['consumableType']
    });
  }
}
