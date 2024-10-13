import { State } from "./State";
import { VendingMachine } from "../VendingMachine";
import { DispensingState } from "./DispensingState";
import { WaitingState } from "./WaitingState";
import { PaymentMethod } from "../models/Payment";
import { Logger } from "../utils/Logger";
import { MoneyHandler } from "../utils/MoneyHandler";

export class PaymentState implements State {
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor(public vendingMachine: VendingMachine) {}

  displayOptions = (): void => {
    Logger.log("===== 결제 방법 선택 =====");
    if (this.vendingMachine.getAvailableChange() > 0) {
      Logger.log("1. 현금");
    }
    Logger.log("2. 카드");
    Logger.log("취소하려면 '취소'를 입력하세요.");
  };

  handleUserInput = async (input: string): Promise<void> => {
    if (input.toLowerCase() === "취소") {
      this.vendingMachine.setState(new WaitingState(this.vendingMachine));
      return;
    }

    switch (input) {
      case "현금":
        if (this.vendingMachine.getAvailableChange() > 0) {
          await this.handleCashPayment();
        } else {
          Logger.log(
            "현재 현금 결제를 이용할 수 없습니다. 카드를 선택해주세요."
          );
        }
        break;
      case "카드":
        await this.handleCardPayment();
        break;
      default:
        Logger.log("잘못된 입력입니다. (현금) 또는 (카드)를 선택하세요.");
    }
  };

  handleCashPayment = async (): Promise<void> => {
    const selectedDrink = this.vendingMachine.getSelectedDrink();
    if (!selectedDrink) {
      Logger.error("선택된 음료가 없습니다. 처음부터 다시 시작해주세요.");
      this.vendingMachine.setState(new WaitingState(this.vendingMachine));
      return;
    }
    if (!this.vendingMachine.isCashSlotWorking()) {
      Logger.log("현금 투입구에 문제가 있습니다. 카드 결제를 이용해주세요.");
      return;
    }
    Logger.log("입력 형식: '금액:개수, 금액:개수, ...' (예: 1000:1, 500:2)");
    Logger.log("취소하려면 '취소'를 입력하세요.");

    let totalAmount = 0;
    while (
      totalAmount < selectedDrink.price &&
      this.retryCount < this.maxRetries
    ) {
      const input = await this.promptForCashInput();
      if (input.toLowerCase() === "취소") {
        await this.cancelCashPayment(totalAmount);
        return;
      }

      const insertedMoney = MoneyHandler.parseInsertedMoney(input);
      if (!insertedMoney) {
        Logger.log("잘못된 입력 형식입니다. 다시 시도해주세요.");
        this.retryCount++;
        continue;
      }

      const insertedAmount = MoneyHandler.calculateTotalAmount(insertedMoney);
      if (totalAmount + insertedAmount > 10000) {
        Logger.log("최대 투입 금액을 초과했습니다. 다시 시도해주세요.");
        this.retryCount++;
        continue;
      }

      totalAmount += insertedAmount;
      Logger.log(`현재 투입 금액: ${totalAmount}원`);

      // 자판기 현금 재고 업데이트
      insertedMoney.forEach((count, denomination) => {
        this.vendingMachine.updateCashInventory(denomination, count);
      });

      this.retryCount = 0; // 성공적인 투입 후 재시도 횟수 리셋
    }

    if (this.retryCount >= this.maxRetries) {
      Logger.log(
        "최대 재시도 횟수를 초과했습니다. 처음부터 다시 시작해주세요."
      );
      await this.cancelCashPayment(totalAmount);
      this.vendingMachine.setState(new WaitingState(this.vendingMachine));
      return;
    }

    const change = MoneyHandler.calculateChange(
      totalAmount,
      selectedDrink.price,
      this.vendingMachine.getCashInventory()
    );

    if (!change) {
      Logger.log("거스름돈을 줄 수 없습니다. 카드 결제를 이용해주세요.");
      await this.cancelCashPayment(totalAmount);
      return;
    }

    this.vendingMachine.setPaymentMethod(PaymentMethod.CASH);
    this.vendingMachine.setPaymentAmount(totalAmount);
    this.vendingMachine.setState(new DispensingState(this.vendingMachine));
  };

  handleCardPayment = async (): Promise<void> => {
    const selectedDrink = this.vendingMachine.getSelectedDrink();
    if (!selectedDrink) {
      Logger.error("선택된 음료가 없습니다. 처음부터 다시 시작해주세요.");
      this.vendingMachine.setState(new WaitingState(this.vendingMachine));
      return;
    }
    const success = await this.simulateCardPayment();
    if (success) {
      this.vendingMachine.setPaymentMethod(PaymentMethod.CARD);
      this.vendingMachine.setPaymentAmount(selectedDrink.price);
      this.vendingMachine.setState(new DispensingState(this.vendingMachine));
    } else {
      Logger.log("카드 결제에 실패했습니다.");
      this.retryCount++;
      if (this.retryCount >= this.maxRetries) {
        Logger.log(
          "결제 재시도 횟수를 초과했습니다. 처음부터 다시 시도해주세요."
        );
        this.vendingMachine.setState(new WaitingState(this.vendingMachine));
      } else {
        Logger.log("다시 시도하거나 다른 결제 방법을 선택해주세요.");
        this.displayOptions();
      }
    }
  };

  promptForCashInput = async (): Promise<string> => {
    return new Promise((resolve) => {
      this.vendingMachine.rl.question(
        "금액을 투입하세요 (또는 '취소' 입력): ",
        (answer) => {
          resolve(answer);
        }
      );
    });
  };

  cancelCashPayment = async (amount: number): Promise<void> => {
    Logger.log(`${amount}원을 반환합니다.`);
    const returnCash = MoneyHandler.calculateChange(
      amount,
      0,
      this.vendingMachine.getCashInventory()
    );
    if (returnCash) {
      MoneyHandler.updateCashInventory(this.vendingMachine, returnCash, true);
      Logger.log("금액이 반환되었습니다.");
      Logger.log("반환된 금액:");
      returnCash.forEach((count, denomination) => {
        Logger.log(`${denomination}원: ${count}개`);
      });
    } else {
      Logger.error("금액 반환에 실패했습니다. 관리자에게 문의해주세요.");
    }
    this.vendingMachine.setState(new WaitingState(this.vendingMachine));
  };

  simulateCardPayment = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() < 0.8; // 80% 성공 확률
        resolve(success);
      }, 2000);
    });
  };
}
