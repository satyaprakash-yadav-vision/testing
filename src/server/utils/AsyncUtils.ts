export class AsyncUtils {
  /**
   * This function is to be called rather than calling Async without await to let the function execute immediately
   * @param functor
   * @param args : functor arguments
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  static executeOnNextTick(functor: Function, ...args: any[]) {
    setImmediate(async () => {
      try {
        if (args?.length > 0) {
          return await functor(...args);
        }
        await functor();
      } catch (err) {
        console.error(err);
      }
    });
  }
}
