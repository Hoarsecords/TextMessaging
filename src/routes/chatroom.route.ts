import { Router } from 'express';
import {
  connectToChatRoom,
  disconnectFromChatRoom,
} from '../resolvers/chatroom/index.resolver';
import User from '../models/user';
import AuthRepo from '../repos/auth.repo';

const chatRouter = Router();

chatRouter.get('/', async (req, res) => {
  const user = await User.findByPk(1);
  if (!user) return res.status(404).json({});
  const payload = await AuthRepo.login(user, res);
  return res.status(200).send(payload);
});

chatRouter.post('/connect/:chatroomId', connectToChatRoom);
chatRouter.post('/disconnect/:chatroomId', disconnectFromChatRoom);

export default chatRouter;
