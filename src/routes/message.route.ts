import { Router } from 'express';
import MessageRepo from '../repos/message.repo';
import User from '../models/user';
import AuthRepo from '../repos/auth.repo';
import ChatRoom from '../models/chatroom';

const messageRouter = Router();

messageRouter.post('/send-message', async (req, res) => {
  const text = 'heehhrehrhad';
  const messageRepo = new MessageRepo();
  const payload = await AuthRepo.getPayload(req.cookies.token);

  const { data, error } = payload.getResult();
  console.log(data);
  if (error || !data) {
    return res.status(500).json({ error: 'Invalid token' });
  }
  const user = await User.findByPk(data.id);

  if (!user) return res.status(404).json({ error: 'User not found' });

  const chatroom = await ChatRoom.findByPk(1);
  if (!chatroom) return res.status(404).json({ error: 'Chatroom not found' });

  const response = messageRepo.sendMessage(user, chatroom, text);

  return res.status(200).send(response);
});

export default messageRouter;
