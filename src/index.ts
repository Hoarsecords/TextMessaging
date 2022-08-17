import express from 'express';
import 'reflect-metadata';
import connection from './config/connection';

require('dotenv-safe').config();

const main = async () => {
  const app = express();

  app.get('/', (_req, res) => {
    res.status(200).send('Hello World');
  });

  const port = process.env.PORT || 4000;

  await connection.sync();

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
};

main();
