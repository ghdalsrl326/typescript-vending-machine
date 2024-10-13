export enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
}

export class Payment {
  private _amount: number = 0;

  constructor(public readonly method: PaymentMethod) {}

  get amount(): number {
    return this._amount;
  }

  addAmount = (value: number): void => {
    this._amount += value;
  };

  reset = (): void => {
    this._amount = 0;
  };
}
