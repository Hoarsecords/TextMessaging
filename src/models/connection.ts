import { Table, Model, ForeignKey, Column } from 'sequelize-typescript';
import ChatRoom from './chatroom';
import User from './user';

@Table
class ChatRoomUser extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => ChatRoom)
  @Column
  chatroomId: number;

  @Column
  test: number;
}

export default ChatRoomUser;
