import { Repository } from "typeorm";
import { IService } from "../../core/interfaces/IService";
import { Bill } from "../../core/entities/Bill";
import { SaveBillDTO } from "../DTOs/BillsDTO";
import { billSchema } from "../validations/BillValidations";
export class BillService implements IService {
  public constructor(private billRepository: Repository<Bill>) {
    this.billRepository = billRepository;
  }
  saveAll(body: any[]): Promise<any[]> {
    throw new Error("Method not implemented.");
  }

  async save(body: SaveBillDTO): Promise<any> {
    const data: SaveBillDTO = body;
    const bill: Bill = new Bill();
    bill.cashRegister =   data.cashRegister;
    bill.total = data.total;
    bill.customer = data.customer;
    bill.date =  data.date;
    console.log("Guardando factura...");
    return await this.billRepository.save(bill);
  }

  delete(id: number): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update(body: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<any[]> {
    console.log(`Obteniendo facturas...`);
    return this.billRepository.find();
  }
}
