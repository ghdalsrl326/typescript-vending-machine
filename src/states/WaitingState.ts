import { State } from "./State";
import { VendingMachine } from "../VendingMachine";
import { SelectDrinkState } from "./SelectDrinkState";
import { Logger } from "../utils/Logger";

export class WaitingState implements State {
  constructor(public vendingMachine: VendingMachine) {}

  displayOptions = (): void => {
    Logger.log("===== 자판기 대기 중 =====");
    Logger.log("음료를 선택하려면 '음료'를 입력하세요.");
  };

  handleUserInput = async (input: string): Promise<void> => {
    if (input.toLowerCase() === "음료") {
      this.vendingMachine.setState(new SelectDrinkState(this.vendingMachine));
    } else {
      Logger.log("잘못된 입력입니다. '음료'를 입력하세요.");
    }
  };
}
