import ChatRoom from '../models/chatroom';
import ChatRoomUser from '../models/connection';
import User from '../models/user';
import { ISubject } from '../types/Subject.type';
import { BooleanResponse, RepoError } from './../types/RepoError';
import { Result } from './../types/RepoResult';
import { IRepo, RepoResult } from './index.types';
import UserRepo from './user.repo';

type IChatRoomRepo = IRepo<ChatRoom> & ISubject<ChatRoom, User>;

export default class ChatRoomRepo implements IChatRoomRepo {
  async findById(id: number): RepoResult<ChatRoom> {
    const chatroom = await ChatRoom.findByPk(id);

    return chatroom
      ? Result.ok<ChatRoom>(chatroom)
      : Result.fail<RepoError>({
          code: 404,
          message: 'ChatRoom not found',
          name: 'chatroom',
        });
  }

  async save(chatroom: ChatRoom): RepoResult<ChatRoom> {
    const newChatRoom = await chatroom.save();

    return newChatRoom
      ? Result.ok<ChatRoom>(chatroom)
      : Result.fail<RepoError>({
          code: 500,
          message: 'ChatRoom not saved',
          name: 'chatroom',
        });
  }

  async getSubscribers(chatroomId: number) {
    const connections = await ChatRoomUser.findAll({
      where: { chatroomId },
      include: [User],
    });

    return connections;
  }

  async registerObserver(
    user: User,
    chatroom: ChatRoom
  ): Promise<BooleanResponse<ChatRoom>> {
    if (!chatroom) {
      return {
        success: false,
        error: { code: 500, message: 'Not implemented', name: 'observer' },
      };
    }
    const connection = await ChatRoomUser.findOne({
      where: { chatroomId: chatroom.id, userId: user.id },
    });

    if (connection) {
      return {
        success: false,
        error: { code: 400, message: 'User already connected', name: 'user' },
      };
    }

    const newChatRoomUser = await ChatRoomUser.create({
      chatroomId: chatroom.id,
      userId: user.id,
    });

    return newChatRoomUser
      ? { success: true, value: chatroom }
      : {
          success: false,
          error: {
            code: 500,
            message: 'ChatRoomUser not created',
            name: 'chatroomuser',
          },
        };
  }
  async removeObserver(
    user: User,
    chatroom: ChatRoom
  ): Promise<BooleanResponse<ChatRoom>> {
    const connection = await ChatRoomUser.findOne({
      where: { chatroomId: chatroom.id, userId: user.id },
    });

    if (!connection) {
      return {
        success: false,
        error: {
          code: 404,
          message: 'User is not connected to this chatroom',
          name: 'user',
        },
      };
    }

    try {
      await connection.destroy();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
  async notifyObservers(subject: ChatRoom, message: any): Promise<void> {
    const connections = await this.getSubscribers(subject.id);
    //todo: send message to all users
    const userRepo = new UserRepo();
    for (const connection of connections) {
      //send message to each user
      userRepo.update(subject, connection.user, { message });
    }
  }
}
