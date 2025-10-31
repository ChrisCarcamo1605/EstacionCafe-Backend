import { IService } from "./IService";

export interface IUserService extends IService{
    getPassword(username:string):Promise<string | null>;
}