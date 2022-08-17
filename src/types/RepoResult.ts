export class Result<V, E> {
  public isSuccess: boolean;
  public isFailure: boolean;
  private error: E;
  private value: V;

  private constructor(isSuccess: boolean, value: V, error: E) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.value = value;
    this.error = error;
  }

  public static ok<V>(value: V): Result<V, undefined> {
    return new Result(true, value, undefined);
  }

  public static fail<E>(error: E): Result<undefined, E> {
    return new Result(false, undefined, error);
  }

  public getError(): E | null {
    return this.error || null;
  }

  public getValue(): V | null {
    return this.value || null;
  }

  public getResult(): { data: V | null; error: E | null } {
    return { data: this.value, error: this.error };
  }
}
