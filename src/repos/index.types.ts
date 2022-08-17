import { RepoError } from '../types/RepoError';
import { Result } from '../types/RepoResult';

export type RepoResult<M> = Promise<
  Result<M | undefined, RepoError | undefined>
>;

export interface IRepo<M> {
  save(model: M): RepoResult<M>;
  findById(id: string): RepoResult<M>;
}
