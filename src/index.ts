import bodyParser from 'body-parser';
import express from 'express';
import 'reflect-metadata';
import connection from './config/connection';
import cookieParser from 'cookie-parser';
import router from './routes/index.route';

require('dotenv-safe').config();

const main = async () => {
  const app = express();

  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use(router);

  const port = process.env.PORT || 4000;

  await connection.sync();

  app.listen(port, () => {
    console.log(`🚀 server is running on http://localhost:${port}/`);
  });
};

main();
