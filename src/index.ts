/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-restricted-syntax */
/**
 * Using bluebird-global to make .map function of bluebird available via Promise
 * This comment suggested using bluebird-global instead of bluebird to fix the typescript shenanigan
 * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/42084#issuecomment-581993103
 * Futher read the index.d.ts file for more information on the usage
 * node_modules/@types/bluebird-global/index.d.ts
 */
// require('dotenv').config();
import 'source-map-support/register';
import promise from 'bluebird-global';
import momentTz from 'moment-timezone';
/**
 * Importing config before starting anything
 */
import { config } from './config';

import { DB_CONN } from './db/dbConnection';
import { MODELS } from './db/models';

/**
 * importing Server
 */
import { Server } from './server';

/**
 * Set default moment timezone from config
 */
const defaultTimeZone = config.get('server:defaultTimeZone');
momentTz.tz.setDefault(defaultTimeZone);

/**
 * Set bluebird as default promise
 * Need to use any because of declaration bug
 * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/42084
 * Even after importing bluebird-global global assignment of global.Promise = promise is needed for the code to
 * actually work in runtime
 */
global.Promise = <any>promise;

/**
 * Start the server
 */

Promise.all([connectToAccountDb(), addAccountDBModels()])
  .then(() => {
    Server.init();
  })
  .catch(error => {
    console.log(`error in starting Server: ${error}`);
  });

async function connectToAccountDb() {
  try {
    await DB_CONN.authenticate();
  } catch (error: any) {
    throw new Error(`Error connecting to DataBase: ${error}`);
  }
}

async function addAccountDBModels() {
  try {
    for (const Model of Object.values(MODELS)) {
      DB_CONN[Model.name] = Model;
    }
  } catch (error: any) {
    throw new Error(`Error connecting to DataBase Model: ${error}`);
  }
}
