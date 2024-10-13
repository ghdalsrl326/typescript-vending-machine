import { State } from "./State";
import { VendingMachine } from "../VendingMachine";
import { Logger } from "../utils/Logger";
import { PaymentMethod } from "../models/Payment";
import { MoneyHandler } from "../utils/MoneyHandler";
import { ErrorState, ErrorType } from "./ErrorState";
import { WaitingState } from "./WaitingState";

export class DispensingState implements State {
  constructor(public vendingMachine: VendingMachine) {}

  displayOptions = async (): Promise<void> => {
    console.log("===== 음료 제공 중 =====");
    console.log("잠시만 기다려주세요...");
    await this.dispenseDrink();
  };

  handleUserInput = async (input: string): Promise<void> => {
    // Dispense State에서는 사용자 입력을 무시하고 음료 제공 프로세스를 진행.
  };

  dispenseDrink = async (): Promise<void> => {
    const selectedDrink = this.vendingMachine.getSelectedDrink();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!selectedDrink) {
      Logger.error("선택된 음료가 없습니다.");
      this.vendingMachine.setState(
        new ErrorState(this.vendingMachine, ErrorType.INVALID_STATE)
      );
      return;
    }

    try {
      selectedDrink.decreaseStock();
      Logger.log(`${selectedDrink.name}이(가) 제공되었습니다.`);

      if (this.vendingMachine.getPaymentMethod() === PaymentMethod.CASH) {
        const change = MoneyHandler.calculateChange(
          this.vendingMachine.getPaymentAmount(),
          selectedDrink.price
        );

        if (change > 0) {
          const changeReturned = await this.returnChange(change);
          if (!changeReturned) {
            Logger.error("거스름돈 반환에 실패했습니다.");
            this.vendingMachine.setState(
              new ErrorState(this.vendingMachine, ErrorType.NOT_ENOUGH_CHANGE)
            );
            return;
          }
        }
      }

      this.vendingMachine.resetPayment();
      this.vendingMachine.setState(new WaitingState(this.vendingMachine));
    } catch (error) {
      Logger.error("음료 제공 중 오류가 발생했습니다.");
      this.vendingMachine.setState(
        new ErrorState(this.vendingMachine, ErrorType.DISPENSE_FAILURE)
      );
    }
  };

  returnChange = async (amount: number): Promise<boolean> => {
    Logger.log(`${amount}원의 거스름돈을 반환합니다.`);
    // 실제 거스름돈 반환 로직을 구현해야 합니다.
    // 여기서는 간단히 시뮬레이션만 수행합니다.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true; // 실제 구현에서는 반환 성공 여부를 확인해야 합니다.
  };
}
