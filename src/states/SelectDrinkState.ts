import { State } from "./State";
import { VendingMachine } from "../VendingMachine";
import { PaymentState } from "./PaymentState";
import { WaitingState } from "./WaitingState";
import { Logger } from "../utils/Logger";

export class SelectDrinkState implements State {
  constructor(public vendingMachine: VendingMachine) {}

  displayOptions = (): void => {
    console.log("===== 음료 선택 =====");
    this.vendingMachine.displayAvailableDrinks();
    console.log("취소하려면 '취소'를 입력하세요.");
  };

  handleUserInput = async (input: string): Promise<void> => {
    if (input.toLowerCase() === "취소") {
      this.vendingMachine.setState(new WaitingState(this.vendingMachine));
      return;
    }

    const selectedDrink = this.vendingMachine.getDrink(input);
    if (selectedDrink && selectedDrink.isAvailable()) {
      this.vendingMachine.setSelectedDrink(selectedDrink);
      this.vendingMachine.setState(new PaymentState(this.vendingMachine));
    } else {
      Logger.log(
        "잘못된 음료를 선택했거나 재고가 없습니다. 다시 선택해주세요."
      );
    }
  };
}
