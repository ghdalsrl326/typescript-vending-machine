import { State } from "./State";
import { VendingMachine } from "../VendingMachine";
import { WaitingState } from "./WaitingState";
import { Logger } from "../utils/Logger";

export enum ErrorType {
  MACHINE_ERROR,
  COIN_JAM,
  DISPENSE_FAILURE,
  POWER_FAILURE,
  NOT_ENOUGH_STOCK,
  NOT_ENOUGH_CHANGE,
  INVALID_STATE,
}

export class ErrorState implements State {
  constructor(
    public vendingMachine: VendingMachine,
    private errorType: ErrorType
  ) {}

  displayOptions = (): void => {
    console.log("===== 오류 발생 =====");
    switch (this.errorType) {
      case ErrorType.MACHINE_ERROR:
        console.log("자판기에 문제가 발생했습니다.");
        break;
      case ErrorType.COIN_JAM:
        console.log("동전/지폐가 걸렸습니다.");
        break;
      case ErrorType.DISPENSE_FAILURE:
        console.log("상품 제공에 실패했습니다.");
        break;
      case ErrorType.POWER_FAILURE:
        console.log("전원 또는 시스템 오류가 발생했습니다.");
        break;
      case ErrorType.INVALID_STATE:
        console.log("자판기가 예상치 못한 상태에 있습니다.");
        break;
    }
    console.log("관리자에게 문의해주세요.");
    console.log("초기 화면으로 돌아가려면 아무 키나 입력하세요.");
  };

  handleUserInput = async (): Promise<void> => {
    switch (this.errorType) {
      case ErrorType.MACHINE_ERROR:
        Logger.error("기기 오류 발생");
        break;
      case ErrorType.COIN_JAM:
        Logger.error("동전/지폐 걸림");
        await this.handleCoinJam();
        break;
      case ErrorType.DISPENSE_FAILURE:
        Logger.error("상품 제공 실패");
        await this.handleDispenseFailure();
        break;
      case ErrorType.POWER_FAILURE:
        Logger.error("전원 또는 시스템 오류");
        await this.handlePowerFailure();
        break;
      case ErrorType.NOT_ENOUGH_STOCK:
        Logger.error("재고 부족");
        await this.handleNotEnoughStock();
        break;
      case ErrorType.NOT_ENOUGH_CHANGE:
        Logger.error("거스름돈 부족");
        await this.handleNotEnoughChange();
        break;
      case ErrorType.INVALID_STATE:
        Logger.error("잘못된 상태");
        await this.handleInvalidState();
        break;
    }

    Logger.log("초기 화면으로 돌아갑니다.");
    this.vendingMachine.setState(new WaitingState(this.vendingMachine));
  };

  private handleCoinJam = async (): Promise<void> => {
    // 동전/지폐 걸림 처리 로직
    Logger.log("동전/지폐 걸림을 해결 중입니다...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    Logger.log("동전/지폐 걸림이 해결되었습니다.");
  };

  private handleDispenseFailure = async (): Promise<void> => {
    // 상품 제공 실패 처리 로직
    Logger.log("환불 처리 중입니다...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    Logger.log("환불 처리가 완료되었습니다.");
  };

  private handlePowerFailure = async (): Promise<void> => {
    // 전원 또는 시스템 오류 처리 로직
    Logger.log("시스템을 재시작 중입니다...");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    Logger.log("시스템이 재시작되었습니다.");
  };

  private handleNotEnoughStock = async (): Promise<void> => {
    // 재고 부족 처리 로직
    Logger.log("재고를 보충 중입니다...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    Logger.log("재고가 보충되었습니다.");
  };

  private handleNotEnoughChange = async (): Promise<void> => {
    // 거스름돈 부족 처리 로직
    Logger.log("거스름돈을 보충 중입니다...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    Logger.log("거스름돈이 보충되었습니다.");
  };

  private handleInvalidState = async (): Promise<void> => {
    // 예상치 못한 상태 처리 로직
    Logger.log("시스템 상태를 초기화 중입니다...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    Logger.log("시스템 상태가 초기화되었습니다.");
    // 여기에 필요한 추가 초기화 로직을 구현할 수 있습니다.
  };
}
