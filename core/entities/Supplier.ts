export class Supplier {
  supplierId: bigint;
  name: string;
  phone: string;
  email: string;
  active: boolean;

  constructor(
    supplierId: bigint,
    name: string,
    phone: string,
    email: string,
    active: boolean
  ) {
    this.supplierId = supplierId;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.active = active;
  }
}
