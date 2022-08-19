import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import 'reflect-metadata';
import connection from './config/connection';
/* import ChatRoom from './models/chatroom'; */
import cookieParser from 'cookie-parser';
import User from './models/user';
import ChatRoomRepo from './repos/chatroom.repo';
import UserRepo from './repos/user.repo';
import router from './routes/index.route';

require('dotenv-safe').config();

const userRepo = new UserRepo();
const chatRoomRepo = new ChatRoomRepo();

const main = async () => {
  const app = express();

  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use(router);

  app.post(
    '/create-user',
    async (_req: Request, res: Response): Promise<Response> => {
      const user: User = new User({
        username: '3b2a222ii',
        email: 'aghon12em22011123@gmail.com',
        name: 'ahmed',
        phone: '0123456789',
      });
      const response = await userRepo.save(user);
      return res.status(201).json(response);
    }
  );
  /*   app.post('/create-chatroom', async (_req: Request, res: Response) => {
    const data = await userRepo.findById(1);

    const { data: user, error } = data.getResult();
    if (error || !user) {
      return res.status(500).json(error);
    }

    const chatRoom = await ChatRoom.create({
      creator: user,
      creatorId: user.id,
    });

    const chatRoomConnection = await chatRoomRepo.connect(chatRoom.id, user);

    return res.status(201).json(chatRoomConnection);
  }); */

  const port = process.env.PORT || 4000;

  await connection.sync();

  app.listen(port, () => {
    console.log(`🚀 App listening on port ${port}`);
  });
};

main();
