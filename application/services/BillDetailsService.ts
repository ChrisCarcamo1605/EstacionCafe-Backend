import { Repository } from "typeorm";
import { IService } from "../../domain/interfaces/IService";
import { BillDetails } from "../../domain/entities/BillDetails";
import { BillDetailsSchema } from "../validations/BillDetailsValidations";
import { SaveBillDetailDTO } from "../DTOs/BillsDTO";
import { Bill } from "../../domain/entities/Bill";

export class BillDetailsService implements IService {
  constructor(
    private detailRepo: Repository<BillDetails>,
    private billService: IService
  ) {
    this.detailRepo = detailRepo;
    this.billService = billService;
  }

  save(body: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async saveAll(body: SaveBillDetailDTO): Promise<any[]> {
    const details: BillDetails[] = [];
    const data: SaveBillDetailDTO = body;

    const bill: Bill = new Bill();
    bill.cashRegister = data.cashRegister;
    bill.customer = data.customer;
    bill.date = data.date;
    bill.total = data.billDetails.reduce((acc, val) => acc + val.subTotal, 0);
    console.log("Guardando factura...");

    const billResult = await this.billService.save(bill);

    data.billDetails.forEach((detail: any) => {
      const newDetail = new BillDetails();
      newDetail.billId = billResult.billId;
      newDetail.productId = detail.productId;
      newDetail.quantity = detail.quantity;
      newDetail.subTotal = detail.subTotal;
      details.push(newDetail);
    });
    console.log("Guardando detalles de la factura...");
    return this.detailRepo.save(details);
  }
  delete(id: number): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update(body: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<any[]> {
    console.log(`Obteniendo bills details...`);

    return this.detailRepo.find({
      relations: ["product", "bill"],
    });
  }
}
