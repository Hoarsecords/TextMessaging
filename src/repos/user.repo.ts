import { RepoError } from './../types/RepoError';
import { Result } from './../types/RepoResult';
import User from '../models/user';
import { IRepo, RepoResult } from './index.types';

class UserRepo implements IRepo<User> {
  async save(user: User): RepoResult<User> {
    const foundUser = await User.findOne({
      where: { email: user.email, username: user.username },
    });
    if (foundUser) {
      return Result.fail<RepoError>({
        code: 400,
        message: 'user already exists',
        name: 'email',
      });
    }

    await user.save();

    return Result.ok<User>(user);
  }

  async findById(id: string): RepoResult<User> {
    const user = await User.findByPk(id);
    return user
      ? Result.ok<User>(user)
      : Result.fail<RepoError>({
          code: 404,
          message: 'User not found',
          name: 'user',
        });
  }
}

export default UserRepo;
