import { RepoError } from './../types/RepoError';
import { Request, Response } from 'express';
import AuthRepo from '../repos/auth.repo';
import User from '../models/user';
import { Result } from '../types/RepoResult';
import { Sequelize } from 'sequelize-typescript';
import UserRepo from '../repos/user.repo';

const login = async (req: Request, res: Response) => {
  const email = req.body?.email;
  if (!email) return res.send(400).json({ error: 'Email is required' });

  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(404).json({ error: 'user not found' });

  const payload = await AuthRepo.login(user, res);

  return res.status(200).json(payload);
};

const randomLogin = async (_req: Request, res: Response) => {
  //get random user from database
  const users = await User.findAll({
    order: Sequelize.literal('random()'),
    limit: 1,
  });

  if (!users || !users.length) {
    return res.status(404).json(
      Result.fail<RepoError>({
        code: 404,
        message: "couldn't fetch a user right now, Please try again later",
        name: 'user',
      })
    );
  }

  const selectedUser = users[0];
  await AuthRepo.login(selectedUser, res);
  return res.status(200).json(selectedUser);
};
const me = async (req: Request, res: Response) => {
  //get random user from database
  const user = await AuthRepo.getLoggedInUser(req);
  if (!user) {
    return res.status(401).json(
      Result.fail<RepoError>({
        code: 401,
        message: 'Not authenticated',
        name: 'user',
      })
    );
  }
  return res.status(200).json(user);
};

const loginWithRandomGeneratedUser = async (_req: Request, res: Response) => {
  const userRepo = new UserRepo();
  const result = await userRepo.fetchRandomUser();
  const { data: user, error } = result.getResult();
  if (!user) return res.status(error?.code || 500).json(error);
  await AuthRepo.login(user, res);
  return res.status(200).json(user);
};
export { login, randomLogin, me, loginWithRandomGeneratedUser };
