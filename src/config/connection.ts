import { Sequelize } from 'sequelize-typescript';

require('dotenv-safe').config();

const connection = new Sequelize({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  sync: { alter: true },
  models: [__dirname + '/../models'],
});

export default connection;
