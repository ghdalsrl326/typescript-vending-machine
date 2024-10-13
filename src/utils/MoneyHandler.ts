import { VendingMachine } from "../VendingMachine";

export class MoneyHandler {
  private static readonly VALID_COINS = [100, 500];
  private static readonly VALID_BILLS = [1000, 5000, 10000];
  static readonly VALID_DENOMINATIONS = [10, 50, 100, 500, 1000, 5000, 10000];

  static parseInsertedMoney(input: string): Map<number, number> | null {
    const insertedMoney = new Map<number, number>();
    const parts = input.split(",").map((part) => part.trim());

    for (const part of parts) {
      const [denomination, count] = part.split(":").map(Number);
      if (
        !this.VALID_DENOMINATIONS.includes(denomination) ||
        isNaN(count) ||
        count <= 0
      ) {
        return null; // 잘못된 입력
      }
      insertedMoney.set(
        denomination,
        (insertedMoney.get(denomination) || 0) + count
      );
    }

    return insertedMoney;
  }

  static calculateTotalAmount(money: Map<number, number>): number {
    return Array.from(money.entries()).reduce(
      (total, [denomination, count]) => total + denomination * count,
      0
    );
  }

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

  static hasEnoughChange = (
    changeAmount: number,
    availableChange: number
  ): boolean => {
    return availableChange >= changeAmount;
  };

  static calculateChange(
    totalAmount: number,
    price: number,
    cashInventory: Map<number, number>
  ): Map<number, number> | null {
    let changeAmount = totalAmount - price;
    const change = new Map<number, number>();
    const denominations = [...cashInventory.keys()].sort((a, b) => b - a);

    for (const denomination of denominations) {
      const availableCount = cashInventory.get(denomination) || 0;
      const count = Math.min(
        Math.floor(changeAmount / denomination),
        availableCount
      );

      if (count > 0) {
        change.set(denomination, count);
        changeAmount -= denomination * count;
      }

      if (changeAmount === 0) break;
    }

    return changeAmount === 0 ? change : null;
  }

  static updateCashInventory(
    vendingMachine: VendingMachine,
    change: Map<number, number>,
    isReturn: boolean
  ): void {
    for (const [denomination, count] of change.entries()) {
      vendingMachine.updateCashInventory(
        denomination,
        isReturn ? -count : count
      );
    }
  }
}
