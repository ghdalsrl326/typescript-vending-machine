import { VendingMachine } from "../VendingMachine";

export interface State {
  vendingMachine: VendingMachine;
  displayOptions(): void;
  handleUserInput(input: string): Promise<void>;
}
