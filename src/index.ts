import 'reflect-metadata';
import buildServer from './utils/buildServer';
import getDBConnection from './utils/getDBConnection';

require('dotenv-safe').config();

const main = async () => {
  const connection = getDBConnection();

  const app = buildServer();

  await connection.sync();

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`🚀 server is running on http://localhost:${port}/`);
  });
};

main();

//for each chatroom, create initiator peer,
/* 
  const mainPeer = new MyPeer({initiator:true,chatroom})

*/
