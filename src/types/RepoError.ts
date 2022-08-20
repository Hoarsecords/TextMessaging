type ErrorCode = 400 | 401 | 404 | 500;

export class RepoError extends Error {
  public code: ErrorCode;
  constructor(message: string, code: ErrorCode) {
    super(message);
    this.code = code;
  }
}

export class BooleanResponse<T> {
  public error?: RepoError;
  public success: boolean;
  public value?: T;
  constructor(error: RepoError, success: boolean) {
    this.error = error;
    this.success = success;
  }
}
