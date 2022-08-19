import { Request, Response } from 'express';
import ChatRoom from '../models/chatroom';
import ChatRoomUser from '../models/connection';
import AuthRepo from '../repos/auth.repo';
import MessageRepo from '../repos/message.repo';
import { RepoError } from '../types/RepoError';
import { Result } from '../types/RepoResult';

const sendMessage = async (req: Request, res: Response) => {
  const { text, chatroomId } = req.body;
  if (!text || !chatroomId) {
    return res.status(401).json({ error: 'text or chatroomId not found' });
  }
  const messageRepo = new MessageRepo();
  const user = await AuthRepo.getLoggedInUser(req);

  if (!user) return res.status(404).json({ error: 'User not found' });

  //check if user is connected to this chatroom or not;
  const chatroom = await ChatRoom.findByPk(Number(chatroomId));
  if (!chatroom) return res.status(404).json({ error: 'Chatroom not found' });

  const connection = await ChatRoomUser.findOne({
    where: { chatroomId, userId: user.id },
  });

  if (!connection) {
    return res.status(401).json(
      Result.fail<RepoError>({
        code: 401,
        message:
          'Logged in user is not connected to this chatroom, Please connect first',
        name: 'user',
      })
    );
  }
  const response = await messageRepo.sendMessage(user, chatroom, text);

  return res.status(200).json(response);
};

export { sendMessage };
