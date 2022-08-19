import axios from 'axios';
import ChatRoom from '../models/chatroom';
import Message from '../models/message';
import User from '../models/user';
import { RepoError } from '../types/RepoError';
import { Result } from '../types/RepoResult';
import { JSONPLACEHOLDER_API_URL } from './../utils/constants';
import ChatRoomRepo from './chatroom.repo';
import { IRepo, RepoResult } from './index.types';

type IMessage = IRepo<Message>;

export default class MessageRepo implements IMessage {
  async save(model: Message): RepoResult<Message> {
    const newMessage = await model.save();

    return newMessage
      ? Result.ok<Message>(newMessage)
      : Result.fail<RepoError>({
          code: 500,
          message: 'Message not saved',
          name: 'message',
        });
  }
  findById(id: string | number): RepoResult<Message> {
    throw new Error('Method not implemented.');
  }
  async getRandomMessage(): Promise<string> {
    const randomMessageId = Math.floor(Math.random() * 10);
    const { data } = await axios.get(
      `${JSONPLACEHOLDER_API_URL}/posts/${randomMessageId}`
    );
    return data.body;
  }
  async sendMessage(
    sender: User,
    chatroom: ChatRoom,
    text: string
  ): RepoResult<Message> {
    const newMessage = await Message.create({
      chatroomId: chatroom.id,
      senderId: sender.id,
      text,
    });
    const chatRoomRepo = new ChatRoomRepo();
    //notify the other user in the chatroom
    await chatRoomRepo.notifyObservers(chatroom, newMessage);
    return Result.ok<Message>(newMessage);
  }
}
