type RepoErrorCode = 400 | 404 | 500;

export class RepoError extends Error {
  public code: RepoErrorCode;
  constructor(message: string, code: RepoErrorCode) {
    super(message);
    this.code = code;
  }
}
