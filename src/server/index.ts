import crypto from 'crypto';
import { HttpServer } from './server';
import { EventLogger } from './utils/logger/EventLogger';
import { ServerEvents } from './lib/events/ServerEvents';
import { AxiosLogger } from './utils/logger/AxiosLogger';
import { ITransactionId } from './lib/events/ILogDocument';
import { ServerApp } from './app';
import { IDebugArg } from './lib/events/EventLoggerRegistry';

const debug = EventLogger.logger('INIT', true);
const serverEvent = ServerEvents.serverEvent();

export class Server {
  /**
   * Start server instance
   */
  public static init = async () => {
    /**
     * Create server level transactionId
     */
    const transactionId: ITransactionId = {
      nameAPI: 'serverInit',
      transactionId: crypto.randomBytes(32).toString('hex')
    };
    const debugArg: IDebugArg = {
      methodName: 'init'
    };

    /**
     * Register Server start and exit events
     */
    // serverEvent.onExit([
    //     {
    //         /**
    //          * Functor to close all database connection
    //          */
    //         // functor: MongoConnector.close
    //     }
    // ]);

    serverEvent.onStart([
      {
        /**
         * Functor to log all calls by axios
         */
        functor: AxiosLogger.registerInterceptors
      }
    ]);

    /**
         * Connect with mongodb

         await MongoConnector.connect();
         debug.info(transactionId, debugArg, 'Database Connected');
         */

    /**
     * Connect with redis
     */

    // Setup our collection of express apps
    const parentApp = await ServerApp.init({ transactionId });
    debug.info(transactionId, debugArg, `Express Apps done`);

    debug.info(transactionId, debugArg, `Starting Server...`);
    await HttpServer.init({ transactionId, baseApp: parentApp });
  };
}
