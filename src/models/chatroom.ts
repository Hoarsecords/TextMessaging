import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import ChatRoomUser from './chatRoomUser';
import User from './user';

@Table
class ChatRoom extends Model {
  @Column({ primaryKey: true })
  id: number;

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @BelongsToMany(() => User, () => ChatRoomUser)
  subscribers: User[];
}

export default ChatRoom;
