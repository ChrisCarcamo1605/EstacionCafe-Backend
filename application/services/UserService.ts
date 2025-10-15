import { Repository } from "typeorm";
import { User } from "../../domain/entities/User";
import { UserType } from "../../domain/entities/UserType";
import { IService } from "../../domain/interfaces/IService";
import { SaveUserDTO } from "../DTOs/UserDTO";
import * as bcrypt from "bcrypt";

export class UserService implements IService {
  private userRepository: Repository<User>;
  constructor(userRepo: Repository<User>) {
    this.userRepository = userRepo;
  }

  saveAll(body: any[]): Promise<any[]> {
    throw new Error("Method not implemented.");
  }

  async save(body: SaveUserDTO): Promise<any> {
    const userData: SaveUserDTO = body;
    const user: User = new User();
    user.username = userData.username;
    user.password = await this.encryptPassword(userData.password);
    user.userTypeId = userData.typeId;
    user.email = userData.email;

    console.log("Guardando usuario...");
    return await this.userRepository.save(user);
  }

  delete(id: number): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update(body: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<any[]> {
    console.log(`Obteniendo usuarios...`);
    return this.userRepository.find({ relations: ["userType"] });
  }

  private async encryptPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}
