import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
class User extends Model {
  @Column({ primaryKey: true })
  id: number;

  @Column(DataType.STRING)
  username: string;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  phone: string;
}

export default User;
