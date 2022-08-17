import express, { Request, Response } from 'express';
import 'reflect-metadata';
import connection from './config/connection';
import ChatRoom from './models/chatroom';
/* import ChatRoom from './models/chatroom'; */
import User from './models/user';
import ChatRoomRepo from './repos/chatroom.repo';
import UserRepo from './repos/user.repo';

require('dotenv-safe').config();

const userRepo = new UserRepo();
const chatRoomRepo = new ChatRoomRepo();

const main = async () => {
  const app = express();

  app.get('/', async (_req, res) => {
    const data = await userRepo.fetchRandomUser();
    res.status(200).send(data);
  });

  app.post(
    '/create-user',
    async (_req: Request, res: Response): Promise<Response> => {
      const user: User = new User({
        username: '3ba22ii',
        email: 'aghonem2011123@gmail.com',
        name: 'ahmed',
        phone: '0123456789',
      });
      const response = await userRepo.save(user);
      return res.status(201).json(response);
    }
  );
  app.post('/create-chatroom', async (_req: Request, res: Response) => {
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

    /*   console.log(resp)
    
   */

    /* const user = await (await userRepo.findById(1)).getValue();
      console.log('hello', user);

      if (!user) return res.status(404).json();
      const chatroom: ChatRoom = await new ChatRoom({
        creator: user,
      }).save();
      console.log(chatroom);
      const connection = chatRoomRepo.connect(chatroom.id, user);
      return res.status(201).json(connection); */
  });

  const port = process.env.PORT || 4000;

  await connection.sync();

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
};

main();
