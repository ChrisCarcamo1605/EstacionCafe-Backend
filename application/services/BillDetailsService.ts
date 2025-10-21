import { Repository } from "typeorm";
import { IService } from "../../core/interfaces/IService";
import { BillDetails } from "../../core/entities/BillDetails";
import { BillDetailsSchema } from "../validations/BillDetailsValidations";
import { SaveBillDetailDTO, SaveBillDTO } from "../DTOs/BillsDTO";
import { Bill } from "../../core/entities/Bill";

export class BillDetailsService implements IService {
  constructor(
    private detailRepo: Repository<BillDetails>,
    private billService: IService
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


  save(body: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async saveAll(body: SaveBillDetailDTO): Promise<any[]> {
    const details: BillDetails[] = [];
    const data: SaveBillDetailDTO = body;

    console.log("entrando al save all");
    const bill: any = {
      cashRegister: data.cashRegister,
      customer: data.customer,
      total: data.billDetails.reduce((acc, val) => acc + val.subTotal, 0),
      date: data.date,
    };
    
    console.log("Guardando factura...");
    console.log(bill);

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
  async delete(id: number): Promise<any> {
     const result = await this.detailRepo.delete(id);
        if (result.affected === 0) {
            throw new Error(`Detalle con ID ${id} no encontrado`);
        }
        return { message: "Detalle eliminado correctamente", id };
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
