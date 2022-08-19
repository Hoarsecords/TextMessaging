import { RepoError } from './../types/RepoError';
import { Result } from './../types/RepoResult';
import { Request, Response, Router } from 'express';
import ChatRoomRepo from '../repos/chatroom.repo';
import UserRepo from '../repos/user.repo';
import ChatRoom from '../models/chatroom';
import {
  connectToChatRoom,
  disconnectFromChatRoom,
} from '../resolvers/chatroom.resolver';
import AuthRepo from '../repos/auth.repo';
import User from '../models/user';

const userRepo = new UserRepo();
const authRepo = new AuthRepo();
const chatRoomRepo = new ChatRoomRepo();

const chatRouter = Router();

chatRouter.post('/connect/:chatroomId', connectToChatRoom);
chatRouter.post('/disconnect/:chatroomId', disconnectFromChatRoom);
chatRouter.post('/create-chatroom', async (req: Request, res: Response) => {
  //get logged in user from jwt token
  const jwtToken = req?.cookies?.token;
  if (!jwtToken) {
    return res.status(401).json(
      Result.fail<RepoError>({
        code: 401,
        message: 'Not authenticated, Please hit the /login endpoint first',
        name: 'token',
      })
    );
  }
  const payload = await AuthRepo.getPayload(jwtToken);

  const { data, error } = payload.getResult();
  if (error || !data) {
    return res.status(500).json(error);
  }

  const user = await User.findByPk(data.id);

  if (!user) {
    //delete the cookie
    return res.status(404).json(
      Result.fail<RepoError>({
        code: 404,
        message: 'User not found',
        name: 'user',
      })
    );
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
