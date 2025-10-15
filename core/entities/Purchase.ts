export class Purchase {
  purchaseId: bigint;
  date: Date;
  cashRegister: bigint;
  supplier: bigint;
  total: number;

  constructor(
    purchaseId: bigint,
    date: Date,
    supplier:bigint,
    cashRegister: bigint,
    total: number
  ) {
    this.purchaseId = purchaseId;
    this.date = date;
    this.cashRegister = cashRegister;
    this.supplier = supplier;
    this.total = total;
  }
}
