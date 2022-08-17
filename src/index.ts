import express, { Request, Response } from 'express';
import 'reflect-metadata';
import connection from './config/connection';
import User from './models/user';
import UserRepo from './repos/user.repo';

require('dotenv-safe').config();

const userRepo = new UserRepo();
const main = async () => {
  const app = express();

  app.get('/', (_req, res) => {
    res.status(200).send('Hello World');
  });

  app.post(
    '/create-user',
    async (_req: Request, res: Response): Promise<Response> => {
      const user: User = new User({
        username: '3ba2ii',
        email: 'aghonem2011@gmail.com',
        name: 'ahmed',
        phone: '0123456789',
      });
      const response = await userRepo.save(user);
      return res.status(201).json(response);
    }
  );

  const port = process.env.PORT || 4000;

  await connection.sync();

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
};

main();
