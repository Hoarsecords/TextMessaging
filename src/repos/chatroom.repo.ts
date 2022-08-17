import ChatRoomUser from '../models/connection';
import User from '../models/user';
import { RepoError } from './../types/RepoError';
import { Result } from './../types/RepoResult';
import { IRepo, RepoResult } from './index.types';
import ChatRoom from '../models/chatroom';

export default class ChatRoomRepo implements IRepo<ChatRoom> {
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

  async subscribe(chatroom: ChatRoom, user: User): RepoResult<ChatRoom> {
    //check if user is already connected
    const connection = await ChatRoomUser.findOne({
      where: { chatroomId: chatroom.id, userId: user.id },
    });

    if (connection) {
      return Result.fail<RepoError>({
        code: 400,
        message: 'User already connected',
        name: 'user',
      });
    }
    const newChatRoomUser = await ChatRoomUser.create({
      chatroomId: chatroom.id,
      userId: user.id,
    });

    return newChatRoomUser
      ? Result.ok<ChatRoom>(chatroom)
      : Result.fail<RepoError>({
          code: 500,
          message: 'ChatRoomUser not created',
          name: 'chatroomuser',
        });
  }

  async connect(chatRoomId: number, user: User): RepoResult<ChatRoom> {
    const data = await this.findById(chatRoomId);
    const val = data.getValue();
    if (!val) {
      return Result.fail<RepoError>({
        code: 404,
        message: 'ChatRoom not found',
        name: 'chatroom',
      });
    }
    return this.subscribe(val, user);
  }
}
