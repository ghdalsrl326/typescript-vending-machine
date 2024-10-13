export class Timer {
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(private callback: () => void, private delay: number) {}

  start = (): void => {
    this.stop();
    this.timeoutId = setTimeout(this.callback, this.delay);
  };

  stop = (): void => {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  };

  reset = (): void => {
    this.stop();
    this.start();
  };
}
