import { Table, Column, Model, DataType, Unique } from 'sequelize-typescript';

export interface UserAttributes {
  username: string;
  email: string;
  name: string;
  phone: string;
}

@Table
class User extends Model<UserAttributes> implements UserAttributes {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Unique
  @Column(DataType.STRING)
  username: string;

  @Column(DataType.STRING)
  name: string;

  @Unique
  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  phone: string;
}

export default User;
