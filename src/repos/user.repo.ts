import {
  DEFAULT_N_VALUE,
  JSONPLACEHOLDER_API_URL,
  MAXIMUM_NUMBER_OF_TRIES,
} from './../utils/constants';
import { RepoError } from './../types/RepoError';
import { Result } from './../types/RepoResult';
import User from '../models/user';
import { IRepo, RepoResult } from './index.types';
import axios from 'axios';
import { Op } from 'sequelize';

class UserRepo implements IRepo<User> {
  async save(user: User): RepoResult<User> {
    const foundUser = await User.findOne({
      where: {
        [Op.or]: { email: user.email, username: user.username },
      },
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

  async findById(id: number): RepoResult<User> {
    const user = await User.findByPk(id);
    return user
      ? Result.ok<User>(user)
      : Result.fail<RepoError>({
          code: 404,
          message: 'User not found',
          name: 'user',
        });
  }

  async getRandomUser(userId: number) {
    try {
      const { data } = await axios.get(
        `${JSONPLACEHOLDER_API_URL}/users/${userId}`
      );
      return { data };
    } catch (error) {
      return { data: null };
    }
  }

  async fetchRandomUser(): RepoResult<User> {
    //1. fetch random user from JSONPLaceholder
    let tries = 0;

    while (tries < MAXIMUM_NUMBER_OF_TRIES) {
      const randomUserId = Math.floor(Math.random() * DEFAULT_N_VALUE); //this might exceed the array length

      const { data: randomUser } = await this.getRandomUser(randomUserId);

      if (!randomUser) {
        tries++;
        continue;
      }

      //check if the user is already in the database
      const newUser = new User({
        username: randomUser.username,
        email: randomUser.email,
        name: randomUser.name,
        phone: randomUser.phone,
      });

      const { isSuccess } = await this.save(newUser);

      if (isSuccess) {
        return Result.ok<User>(newUser);
      }
      //user is already in the database so we need to fetch another one
      tries++;
    }
    return Result.fail<RepoError>({
      code: 500,
      message: 'Failed to fetch a random user',
      name: 'user',
    });
  }
}

export default UserRepo;
