# protopie-vending-machine

## 개발 환경

- Typescript: 4.2.2
- Node: v22

## 실행 방법

- npm i
- npm run start

## State 다이어그램

```mermaid
stateDiagram
    [*] --> WaitingState
    WaitingState --> SelectDrinkState : 음료 선택
    SelectDrinkState --> PaymentState : 음료 선택 완료
    SelectDrinkState --> WaitingState : 취소
    PaymentState --> DispensingState : 결제 성공
    PaymentState --> WaitingState : 취소 / 최대 재시도 초과
    DispensingState --> WaitingState : 음료 제공 완료
    DispensingState --> ErrorState : 제공 실패
    PaymentState --> ErrorState : 거스름돈 부족
    ErrorState --> WaitingState : 오류 처리 완료

    state PaymentState {
        [*] --> CashPayment
        [*] --> CardPayment
        CashPayment --> [*] : 결제 완료 / 취소
        CardPayment --> [*] : 결제 완료 / 취소
    }

    state ErrorState {
        [*] --> MachineError
        [*] --> CoinJam
        [*] --> DispenseFailure
        [*] --> PowerFailure
        [*] --> NotEnoughStock
        [*] --> NotEnoughChange
        [*] --> InvalidState
    }
```
