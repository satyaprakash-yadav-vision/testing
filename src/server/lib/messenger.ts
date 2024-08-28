export class Messenger {
  /**
   * Log success message
   * @param obj
   */
  public static success(obj: any): void {
    console.log(obj);
  }

  /**
   * Log warning message
   * @param obj
   */
  public static warning(obj: any): void {
    console.log(obj);
  }

  /**
   * Log error message
   * @param obj
   */
  public static error(obj: any, error?: Error): void {
    console.error(error?.stack);
    console.log(obj);
  }

  /**
   * Log info message
   * @param obj
   */
  public static info(obj: any): void {
    console.log(obj);
  }
}
