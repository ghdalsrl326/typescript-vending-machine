export class MoneyHandler {
  private static readonly VALID_COINS = [100, 500];
  private static readonly VALID_BILLS = [1000, 5000, 10000];

  static isValidCurrency = (amount: number): boolean => {
    const validDenominations = [...this.VALID_COINS, ...this.VALID_BILLS];
    const dp = Array(amount + 1).fill(false);
    dp[0] = true;

    for (let i = 1; i <= amount; i++) {
      for (const denom of validDenominations) {
        if (i >= denom && dp[i - denom]) {
          dp[i] = true;
          break;
        }
      }
    }

    return dp[amount];
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
