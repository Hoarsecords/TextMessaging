import express from 'express';
import 'reflect-metadata';
import db from './models';

require('dotenv-safe').config();

const main = async () => {
  const app = express();

  app.get('/', (_req, res) => {
    res.status(200).send('Hello World');
  });

  const port = process.env.PORT || 4000;

  db.sequelize.sync().then(() => {
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  });
};

main();
