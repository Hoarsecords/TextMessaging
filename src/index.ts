// server.js
import express from 'express';

const app = express();

app.get('/', (_req, res) => {
  res.status(200).send('Hello World');
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
