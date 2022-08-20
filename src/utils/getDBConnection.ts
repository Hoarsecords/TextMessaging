import { Sequelize } from 'sequelize-typescript';
import DBConfigs from '../config/dbConfigs';
import { isTest } from './isTest';

require('dotenv-safe').config();

let connection: Sequelize | null = null;
const getDBConnection = () => {
  const dbConfig = isTest() ? DBConfigs.test : DBConfigs.development;
  if (!connection) {
    connection = new Sequelize(dbConfig);
  }
  return connection;
};

export default getDBConnection;
