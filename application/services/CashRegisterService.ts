import { Repository } from "typeorm";
import { IService } from "../../core/interfaces/IService";
import { CashRegister } from "../../core/entities/CashRegister";
import { SaveCashRegisterDTO } from "../DTOs/CashRegisterDTO";

export class CashRegisterService implements IService {
    public constructor(private cashRegisterRepository: Repository<CashRegister>) {
        this.cashRegisterRepository = cashRegisterRepository;
    }

    async save(body: SaveCashRegisterDTO): Promise<any> {
        const data: SaveCashRegisterDTO = body;

        const cashRegister: CashRegister = new CashRegister();  
        cashRegister.number = data.number;
        cashRegister.active = data.active !== undefined ? data.active : true;

        return await this.cashRegisterRepository.save(cashRegister);
    }

    async saveAll(body: any[]): Promise<any[]> {
        return await this.cashRegisterRepository.save(body);
    }

    async delete(id: number): Promise<any> {
        const result = await this.cashRegisterRepository.delete(id);
        if (result.affected === 0) {
            throw new Error(`Caja registradora con ID ${id} no encontrada`);
        }
        return { message: "Caja registradora eliminada correctamente", id };
    }

    async update(body: any): Promise<any> {
        const { cashRegisterId, ...updateData } = body;

        if (!cashRegisterId) {
            throw new Error("cashRegisterId es requerido para actualizar");
        }

        const cashRegister = await this.cashRegisterRepository.findOne({ where: { cashRegisterId } });
        if (!cashRegister) {
            throw new Error(`Caja registradora con ID ${cashRegisterId} no encontrada`);
        }

        Object.assign(cashRegister, updateData);
        return await this.cashRegisterRepository.save(cashRegister);
    }

    async getAll(): Promise<any[]> {
        return await this.cashRegisterRepository.find({
            order: { number: "ASC" }
        });
    }

    async getById(id: number): Promise<any> {
        const cashRegister = await this.cashRegisterRepository.findOne({ where: { cashRegisterId: id } });
        if (!cashRegister) {
            throw new Error(`Caja registradora con ID ${id} no encontrada`);
        }
        return cashRegister;
    }

    async getActiveCashRegisters(): Promise<any[]> {
        return await this.cashRegisterRepository.find({
            where: { active: true },
            order: { number: "ASC" }
        });
    }

    async getByNumber(number: string): Promise<any[]> {
        return await this.cashRegisterRepository.find({
            where: { number },
            order: { number: "ASC" }
        });
    }
}