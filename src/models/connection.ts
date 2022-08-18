import {
  Table,
  Model,
  ForeignKey,
  Column,
  BelongsTo,
} from 'sequelize-typescript';
import ChatRoom from './chatroom';
import User from './user';

@Table
class ChatRoomUser extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => ChatRoom)
  @Column
  chatroomId: number;

  @BelongsTo(() => ChatRoom)
  chatroom: ChatRoom;
}

export default ChatRoomUser;
