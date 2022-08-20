import { Request, Response } from 'express';
import ChatRoom from '../models/chatroom';
import User from '../models/user';
import AuthRepo from '../repos/auth.repo';
import ChatRoomRepo from '../repos/chatroom.repo';
import UserRepo from '../repos/user.repo';
import { RepoError } from '../types/RepoError';
import { Result } from '../types/RepoResult';

const userRepo = new UserRepo();

const connectToChatRoom = async (req: Request, res: Response) => {
  const chatRoomRepo = new ChatRoomRepo();
  const { chatroomId } = req.params;

  //user should be get from token
  let user: User | null = await AuthRepo.getLoggedInUser(req);
  if (!user) {
    //1.fetch a random user from JSONPlaceholder and continue
    const response = await userRepo.fetchRandomUser();
    const { data, error } = response.getResult();

    if (!data) {
      return res.status(error?.code || 500).json(error);
    }
    //2. send jwt cookie back to the user to be able to identify him in the future
    await AuthRepo.login(data, res);
    user = data;
  }

  //find or create a chatroom
  const [chatroom] = await ChatRoom.findOrCreate({
    where: {
      id: Number(chatroomId),
    },
    defaults: {
      creatorId: user.id,
      creator: user,
    },
  });

  if (!chatroom) {
    return res.status(404).json(
      Result.fail<RepoError>({
        code: 404,
        message: 'ChatRoom not found',
        name: 'chatroom',
      })
    );
  }
  const chatRoomConnection = await chatRoomRepo.registerObserver(
    user,
    chatroom
  );

  return res.status(201).json(chatRoomConnection);
};

const disconnectFromChatRoom = async (req: Request, res: Response) => {
  const chatRoomRepo = new ChatRoomRepo();

  const { chatroomId } = req.params;

  //user should be get from token
  const authPayload = await AuthRepo.getPayload(req?.cookies?.token);
  const userInfo = authPayload.getValue();

  if (!userInfo) {
    return res.status(401).json(
      Result.fail<RepoError>({
        code: 401,
        message: 'User not authenticated',
        name: 'user',
      })
    );
  }

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
