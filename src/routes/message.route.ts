import { Router } from 'express';

import { sendMessage } from '../resolvers/message.resolver';

const messageRouter = Router();

messageRouter.post('/send-message', sendMessage);

export default messageRouter;
