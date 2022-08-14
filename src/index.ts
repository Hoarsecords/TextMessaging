import express from 'express';
import { Sequelize } from 'sequelize';
require('dotenv-safe').config();

import 'reflect-metadata';

const main = async () => {
  const sequelizeConnection = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  await sequelizeConnection.authenticate().then(() => {
    console.log('connected to db');
  });

  const app = express();

  app.get('/', (_req, res) => {
    res.status(200).send('Hello World');
  });

  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

main();
