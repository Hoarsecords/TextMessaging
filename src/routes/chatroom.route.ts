import { Router } from 'express';
import {
  connectToChatRoom,
  disconnectFromChatRoom,
} from '../resolvers/chatroom.resolver';

const chatRouter = Router();

chatRouter.post('/connect/:chatroomId', connectToChatRoom);
chatRouter.post('/disconnect/:chatroomId', disconnectFromChatRoom);

export default chatRouter;
