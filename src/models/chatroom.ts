import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import ChatRoomUser from './connection';
import User from './user';

@Table
class ChatRoom extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
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
