export class Util {
  public static async Sleep(ms: number): Promise<number> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(ms);
      }, ms);
    });
  }
  /**
   * promisify the function
   * it will be remove when vscode use node@^8.0
   * @param fn
   */
  public static promisify(
    fn: (...args: any[]) => any
  ): (...whatever: any[]) => Promise<any> {
    return (...argv) => {
      return new Promise((resolve, reject) => {
        fn.call(this, ...argv, (err: any, data: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    };
  }
}
