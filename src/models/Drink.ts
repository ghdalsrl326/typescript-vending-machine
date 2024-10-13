export class Drink {
  constructor(
    public readonly name: string,
    public readonly price: number,
    private _stock: number
  ) {}

  get stock(): number {
    return this._stock;
  }

  decreaseStock = (): void => {
    if (this._stock > 0) {
      this._stock--;
    }
  };

  isAvailable = (): boolean => {
    return this._stock > 0;
  };
}
