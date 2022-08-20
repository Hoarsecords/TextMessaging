import { SequelizeOptions } from 'sequelize-typescript';
require('dotenv-safe').config();

type ConfigKey = 'development' | 'production' | 'test';

const DBConfigs: { [key in ConfigKey]: SequelizeOptions } = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    sync: { alter: true },
    models: [__dirname + '/../models'],
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    sync: { alter: true },
    models: [__dirname + '/../models'],
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    sync: { alter: true },
    models: [__dirname + '/../models'],
  },
};
export default DBConfigs;
