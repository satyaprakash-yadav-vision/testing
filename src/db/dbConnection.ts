import { Sequelize } from 'sequelize';
import { CONSTANT_CONFIG } from '../config/CONSTANT_CONFIG';

export const DB_CONN = new Sequelize({
  dialect: 'mysql',
  host: CONSTANT_CONFIG.DATABASE.HOST,
  port: CONSTANT_CONFIG.DATABASE.PORT,
  database: CONSTANT_CONFIG.DATABASE.NAME,
  username: CONSTANT_CONFIG.DATABASE.USER,
  password: CONSTANT_CONFIG.DATABASE.PASSWORD,
  logging: true
});
