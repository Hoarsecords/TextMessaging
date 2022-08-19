import { Sequelize } from 'sequelize-typescript';

require('dotenv-safe').config();

let connection: Sequelize | null = null;
const getDBConnection = () => {
  if (!connection) {
    connection = new Sequelize({
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      dialect: 'postgres',
      sync: { alter: true },
      models: [__dirname + '/../models'],
    });
  }
  return connection;
};

export default getDBConnection;
