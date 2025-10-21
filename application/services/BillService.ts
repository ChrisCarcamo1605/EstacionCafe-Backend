import { Repository } from "typeorm";
import { IService } from "../../core/interfaces/IService";
import { Bill } from "../../core/entities/Bill";
import { SaveBillDTO, UpdateBillDTO } from "../DTOs/BillsDTO";
import { billSchema } from "../validations/BillValidations";
import { error } from "console";
import { any } from "zod";

export class BillService implements IService {
  public constructor(private billRepository: Repository<Bill>) {
    this.billRepository = billRepository;
  }
  async getById(id: number): Promise<any> {
    console.log(`Obteniendo factura con ID: ${id}`);
    return await this.billRepository.findOne({ where: { billId:id } });
  }
   async saveAll(body: SaveBillDTO[]): Promise<Bill[]> {
    const bills = body.map((data) => {
      const bill = new Bill();
      bill.cashRegisterId = data.cashRegister;
      bill.total = data.total;
      bill.customer = data.customer;
      bill.date = data.date;
      return bill;
    });
    return await this.billRepository.save(bills);
  }
  

  async save(body: SaveBillDTO): Promise<any> {
    const data: SaveBillDTO = body;
    const bill: Bill = new Bill();
    bill.cashRegisterId = data.cashRegister;
    bill.total = data.total;
    bill.customer = data.customer;
    bill.date = data.date;
    console.log("Guardando factura...");
    console.log(bill);
    return await this.billRepository.save(bill);
  }

  async delete(id: number): Promise<any> {
    const result = await this.billRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Factura con ID ${id} no encontrada`);
    }
    return { message: "Factura eliminada correctamente", id };
  }
  async update(body: UpdateBillDTO): Promise<any> {
    const { billId, ...updateData } = body;

    if (!billId) {
      throw new Error("billId es requerido para actualizar");
    }

    const bill = await this.billRepository.findOne({
      where: { billId },
    });

    console.log(bill);

    if (!bill) {
      throw new Error(`Factura con ID ${billId} no encontrada`);
    }

    Object.assign(bill, updateData);
    console.log(bill);

    return await this.billRepository.save(bill);
  }

  async getAll(): Promise<any[]> {
    console.log(`Obteniendo facturas...`);
    return this.billRepository
      .find({
        relations: ["cashRegister"],
        order: { date: "DESC" },
      })
      .catch((error: any) => {
        console.log(error);
        throw error;
      });
  }

  async getById(id: number): Promise<any> {
    const bill = await this.billRepository.findOne({
      where: { billId: id },
      relations: ["cashRegister"],
    });
    if (!bill) {
      throw new Error(`Factura con ID ${id} no encontrada`);
    }
    return bill;
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<Bill[]> {
    return await this.billRepository
      .createQueryBuilder("bill")
      .leftJoinAndSelect("bill.cashRegister", "cashRegister")
      .where("bill.date >= :startDate", { startDate })
      .andWhere("bill.date <= :endDate", { endDate })
      .orderBy("bill.date", "DESC")
      .getMany();
  }

  async getBillsByCustomer(customer: string): Promise<Bill[]> {
    return await this.billRepository.find({
      where: { customer },
      relations: ["cashRegister"],
      order: { date: "DESC" },
    });
  }
}
