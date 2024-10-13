import * as readline from "readline";
import { Drink } from "./models/Drink";
import { Payment, PaymentMethod } from "./models/Payment";
import { State } from "./states/State";
import { WaitingState } from "./states/WaitingState";
import { Logger } from "./utils/Logger";

export class VendingMachine {
  private drinks: Drink[];
  private state: State;
  private selectedDrink: Drink | null = null;
  private payment: Payment | null = null;
  private cashSlotWorking: boolean;
  private cashInventory: Map<number, number>;

  rl: readline.Interface;

  constructor() {
    this.drinks = [
      new Drink("콜라", 1100, 10),
      new Drink("물", 600, 1),
      new Drink("커피", 700, 15),
    ];
    this.state = new WaitingState(this);
    this.cashSlotWorking = true; // 초기 현금 투입구 상태
    this.cashInventory = new Map([
      [100, 50], // 현금 단위, 개수
      [500, 50],
      [1000, 50],
      [5000, 50],
      [10000, 50],
    ]);

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  getState = (): State => {
    return this.state;
  };

  setState = (state: State): void => {
    this.state = state;
    this.state.displayOptions();
  };

  handleUserInput = async (input: string): Promise<void> => {
    await this.state.handleUserInput(input);
  };

  displayWaitingScreen = (): void => {
    this.state.displayOptions();
  };

  displayAvailableDrinks = (): void => {
    Logger.log("구입 가능한 음료:");
    this.drinks.forEach((drink, index) => {
      if (drink.isAvailable()) {
        Logger.log(`${drink.name} - ${drink.price}원`);
      }
    });
  };

  getDrink = (name: string): Drink | undefined => {
    return this.drinks.find((drink) => drink.name === name);
  };

  setSelectedDrink = (drink: Drink): void => {
    this.selectedDrink = drink;
  };

  getSelectedDrink = (): Drink | null => {
    return this.selectedDrink;
  };

  setPaymentMethod = (method: PaymentMethod): void => {
    this.payment = new Payment(method);
  };

  getPaymentMethod = (): PaymentMethod | null => {
    return this.payment?.method ?? null;
  };

  setPaymentAmount = (amount: number): void => {
    this.payment?.addAmount(amount);
  };

  getPaymentAmount = (): number => {
    return this.payment?.amount ?? 0;
  };

  resetPayment = (): void => {
    this.payment = null;
  };

  //   getAvailableChange = (): number => {
  //     return this.availableChange;
  //   };

  //   updateAvailableChange = (amount: number): void => {
  //     this.availableChange += amount;
  //   };

  isCashSlotWorking = (): boolean => {
    return this.cashSlotWorking;
  };

  setCashSlotWorking = (isWorking: boolean): void => {
    this.cashSlotWorking = isWorking;
  };

  getCashInventory(): Map<number, number> {
    return new Map(this.cashInventory);
  }

  updateCashInventory(denomination: number, count: number): void {
    const currentCount = this.cashInventory.get(denomination) || 0;
    this.cashInventory.set(denomination, currentCount + count);
  }
}
