import { Request, Response, Router } from 'express';
import ChatRoomRepo from '../repos/chatroom.repo';
import UserRepo from '../repos/user.repo';
import ChatRoom from '../models/chatroom';
import {
  connectToChatRoom,
  disconnectFromChatRoom,
} from '../resolvers/chatroom/index.resolver';

const userRepo = new UserRepo();
const chatRoomRepo = new ChatRoomRepo();

const chatRouter = Router();

chatRouter.post('/connect/:chatroomId', connectToChatRoom);
chatRouter.post('/disconnect/:chatroomId', disconnectFromChatRoom);
chatRouter.post('/create-chatroom', async (_req: Request, res: Response) => {
  const data = await userRepo.findById(1);

  const { data: user, error } = data.getResult();
  if (error || !user) {
    return res.status(500).json(error);
  }

  const chatRoom = await ChatRoom.create({
    creator: user,
    creatorId: user.id,
  });

  const chatRoomConnection = await chatRoomRepo.registerObserver(
    user,
    chatRoom
  );

  return res.status(201).json(chatRoomConnection);
});

export default chatRouter;
