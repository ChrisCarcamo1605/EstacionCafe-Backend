import { Repository } from "typeorm";
import { IService } from "../../domain/interfaces/IService";
import { UserType } from "../../domain/entities/UserType";

export class UserTypeService implements IService {
  private typeRepo: Repository<UserType>;
  constructor(typeRepository: Repository<UserType>) {
    this.typeRepo = typeRepository;
  }

  save(body: any): Promise<any> {
    const type = new UserType();
    type.name = body.name;
    type.permissionLevel = body.permissionLevel;
    console.log("Guardando tipo de usuario...");
    return this.typeRepo.save(type);
  }
  saveAll(body: any[]): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  delete(id: number): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update(body: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<any[]> {
    console.log(`Obteniendo tipos de usuarios...`);
    return this.typeRepo.find();
  }
}
