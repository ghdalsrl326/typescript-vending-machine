import * as readline from "readline";
import { Drink } from "./models/Drink";
import { Payment, PaymentMethod } from "./models/Payment";
import { State } from "./states/State";
import { WaitingState } from "./states/WaitingState";

export class VendingMachine {
  private drinks: Drink[];
  private state: State;
  private selectedDrink: Drink | null = null;
  private payment: Payment | null = null;
  private availableChange: number;
  private cashSlotWorking: boolean;
  private cashInventory: Map<number, number>;

  rl: readline.Interface;

  constructor() {
    this.drinks = [
      new Drink("콜라", 1500, 10),
      new Drink("물", 1000, 2),
      new Drink("커피", 2000, 15),
    ];
    this.state = new WaitingState(this);
    this.availableChange = 500; // 초기 거스름돈 설정
    this.cashSlotWorking = true; // 초기 현금 투입구 상태
    this.cashInventory = new Map([
      [10, 0], // 현금 단위, 개수
      [50, 0],
      [100, 0],
      [500, 0],
      [1000, 30],
      [5000, 20],
      [10000, 10],
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
    console.log("사용 가능한 음료:");
    this.drinks.forEach((drink, index) => {
      if (drink.isAvailable()) {
        console.log(`${drink.name} - ${drink.price}원`);
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

  getAvailableChange = (): number => {
    return this.availableChange;
  };

  updateAvailableChange = (amount: number): void => {
    this.availableChange += amount;
  };

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
