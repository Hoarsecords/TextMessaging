import { RepoError } from '../../types/RepoError';
import { Request, Response } from 'express';
import ChatRoomRepo from '../../repos/chatroom.repo';
import ChatRoom from '../../models/chatroom';
import User from '../../models/user';
import AuthRepo from '../../repos/auth.repo';
import { Result } from '../../types/RepoResult';

const chatRoomRepo = new ChatRoomRepo();

const connectToChatRoom = async (req: Request, res: Response) => {
  const { chatroomId } = req.params;

  //user should be get from token
  const authPayload = await AuthRepo.getPayload(req?.cookies?.token);
  const userInfo = authPayload.getValue();

  if (!userInfo)
    return res.status(400).json({ error: 'User not authenticated' });

  const user = await User.findByPk(userInfo.id);

  if (!user)
    return res.status(404).json(
      Result.fail<RepoError>({
        code: 404,
        message: 'user not found',
        name: 'user',
      })
    );

  const chatroom = await ChatRoom.findByPk(Number(chatroomId));

  if (!chatroom)
    return res.status(404).json(
      Result.fail<RepoError>({
        code: 404,
        message: 'ChatRoom not found',
        name: 'chatroom',
      })
    );

  const chatRoomConnection = await chatRoomRepo.registerObserver(
    user,
    chatroom
  );

  return res.status(201).json(chatRoomConnection);
};

const disconnectFromChatRoom = async (req: Request, res: Response) => {
  const { chatroomId } = req.params;

  //user should be get from token
  const authPayload = await AuthRepo.getPayload(req?.cookies?.token);
  const userInfo = authPayload.getValue();

  if (!userInfo)
    return res.status(400).json(
      Result.fail<RepoError>({
        code: 401,
        message: 'User not authenticated',
        name: 'user',
      })
    );

  const user = await User.findByPk(userInfo.id);

  if (!user)
    return res.status(404).json(
      Result.fail<RepoError>({
        code: 404,
        message: 'user not found',
        name: 'user',
      })
    );

  const chatroom = await ChatRoom.findByPk(Number(chatroomId));

  if (!chatroom)
    return res.status(404).json(
      Result.fail<RepoError>({
        code: 404,
        message: 'ChatRoom not found',
        name: 'chatroom',
      })
    );

  const chatRoomConnection = await chatRoomRepo.removeObserver(user, chatroom);

  return res.status(201).json(chatRoomConnection);
};

export { connectToChatRoom, disconnectFromChatRoom };
