import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import router from '../routes/index.route';

const buildServer = (): Application => {
  const app = express();

  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use(router);
  return app;
};
export default buildServer;
