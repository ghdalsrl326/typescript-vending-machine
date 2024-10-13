export class Logger {
  static log = (message: string): void => {
    console.log(`[LOG] ${message}`);
  };

  static error = (message: string): void => {
    console.error(`[ERROR] ${message}`);
  };
}
