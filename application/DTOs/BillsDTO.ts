export interface SaveBillDTO {
  billId: number;
  customer: string;
  cashRegister: number;
  total: number;
  date: Date;
}

export interface BillItemDTO {
  billId: number;
  customer: string;
  cashRegister?: string;
  total: number;
  date?: Date;
}

export interface SaveBillDetailDTO{
  customer: string;
  cashRegister: number;
  date: Date;
  billDetails:any[]
}