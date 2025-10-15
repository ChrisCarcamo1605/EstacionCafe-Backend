export class CashRegister{
    cashRegisterId: bigint;
    number: string;
    active:boolean;

    constructor(cashRegister:bigint, number:string, active: boolean){
        this.cashRegisterId = cashRegister;
        this.number = number;
        this.active = active;
    }
}