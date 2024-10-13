export class MoneyHandler {
  private static readonly VALID_COINS = [100, 500];
  private static readonly VALID_BILLS = [1000, 5000, 10000];

  static isValidCurrency = (amount: number): boolean => {
    return (
      this.VALID_COINS.includes(amount) || this.VALID_BILLS.includes(amount)
    );
  };

  static calculateChange = (totalAmount: number, price: number): number => {
    return totalAmount - price;
  };

  static hasEnoughChange = (
    changeAmount: number,
    availableChange: number
  ): boolean => {
    return availableChange >= changeAmount;
  };
}
