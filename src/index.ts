import { Logger } from "./utils/Logger";
import { VendingMachine } from "./VendingMachine";

const vendingMachine = new VendingMachine();

Logger.log("자판기 시뮬레이터");
Logger.log("명령어를 입력하세요. '종료'를 입력하면 프로그램이 종료됩니다.");

vendingMachine.displayWaitingScreen();

const handleInput = async () => {
  vendingMachine.rl.question("> ", async (input) => {
    if (input.toLowerCase() === "종료") {
      Logger.log("프로그램을 종료합니다.");
      vendingMachine.rl.close();
      return;
    }

    await vendingMachine.handleUserInput(input);
    handleInput();
  });
};

handleInput();
