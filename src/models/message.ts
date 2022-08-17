import ChatRoom from '../models/chatroom';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import User from './user';

@Table
class Message extends Model {
  @Column({ primaryKey: true })
  id: number;

  @Column(DataType.STRING)
  text: string;

  @ForeignKey(() => User)
  @Column
  senderId: number;

  @BelongsTo(() => User)
  sender: User;

  @ForeignKey(() => ChatRoom)
  @Column
  chatroomId: number;

  @BelongsTo(() => ChatRoom)
  chatroom: ChatRoom;
}

export default Message;
