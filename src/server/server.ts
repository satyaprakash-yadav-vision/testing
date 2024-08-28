// # Main Server
// Handles the creation of an HTTP Server for

import * as http from 'http';
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from 'moment';
import { Application } from 'express';
import 'colors';
import { GlobalEventRegistry } from './lib/events';
import { EventLogger } from './utils/logger/EventLogger';
import { ITransactionId } from './lib/events/ILogDocument';
import { NodeUtils } from './utils/NodeUtils';
import { CONSTANT_CONFIG } from '../config/CONSTANT_CONFIG';
import { IDebugArg } from './lib/events/EventLoggerRegistry';

const debug = EventLogger.logger('HttpServer');

/**
 * ## Base Server
 * @constructor
 * @param {Object} rootApp - parent express instance
 */
export class HttpServer {
  private static httpServerObj: HttpServer;

  private connections: any;

  private connectionId: number;

  private baseApp;

  private transactionId: ITransactionId;

  private httpServer: http.Server;

  private constructor({
    transactionId,
    baseApp
  }: {
    transactionId: ITransactionId;
    baseApp: Application;
  }) {
    this.baseApp = baseApp;
    this.transactionId = transactionId;
    this.connections = {};
    this.connectionId = 0;
  }

  public static async init({
    transactionId,
    baseApp
  }: {
    transactionId: ITransactionId;
    baseApp: Application;
  }) {
    if (NodeUtils.isNullOrUndefined(this.httpServerObj)) {
      this.httpServerObj = new HttpServer({ transactionId, baseApp });
      await this.httpServerObj.start();
    }
    return this.httpServerObj.httpServer;
  }

  /**
   * Start the server on init
   * Promisifying the events of the http server
   * @param externalApp
   */
  start = async () => {
    const { transactionId } = this;
    const debugArg: IDebugArg = {
      methodName: 'start'
    };
    debug.info(transactionId, debugArg, `Starting...`);

    const { baseApp } = this;

    await new Promise((resolve, reject) => {
      const { HOST, PORT } = CONSTANT_CONFIG.SERVER;

      this.httpServer = baseApp.listen(PORT, HOST);

      this.httpServer.on('error', (error: Error) => {
        let serverError: Error;
        // eslint-disable-next-line
        const errorNo = error['errno'];
        if (errorNo === 'EADDRINUSE') {
          serverError = new Error(
            `(EADDRINUSE) Cannot start Server. Port  ${PORT} ` +
              `is already in use by another program. Is another Server instance already running?`
          );
        } else {
          serverError = new Error(
            `(Code: '${errorNo}') There was an error starting your server.` +
              ` Please use the error code above to search for a solution.`
          );
        }
        reject(serverError);
      });

      this.httpServer.on('connection', this.connection);

      this.httpServer.on('listening', () => {
        const debugArg: IDebugArg = {
          methodName: 'httpSever-listening'
        };
        debug.info(transactionId, debugArg, '...Started');
        this.logStartMessages();
        resolve(this);
      });
    });

    GlobalEventRegistry.emit(`server.started`, this.httpServer, baseApp);
  };

  /**
   * ### Stop
   * Returns a promise that will be fulfilled when the server stops. If the server has not been started,
   * the promise will be fulfilled immediately
   */
  stop() {
    return new Promise(resolve => {
      if (this.httpServer === null) {
        resolve(this);
      } else {
        this.httpServer.close(() => {
          this.httpServer = null;
          this.logShutdownMessages();
          resolve(this);
        });
        this.closeConnections();
      }
    });
  }

  /**
   * ### Restart
   * Restarts the application
   */
  restart = () => {
    return this.stop().then(this.start);
  };

  /**
   * ### Close Connections
   * Most browsers keep a persistent connection open to the server, which prevents the close callback of
   * httpServer from returning. We need to destroy all connections manually.
   */
  closeConnections = () => {
    Object.keys(this.connections).forEach(socketId => {
      const socket = this.connections[socketId];

      // kill the socket connection
      if (socket) {
        socket.destroy();
      }
    });
  };

  /**
   * ## Private (internal) methods
   *
   * ### Connection
   * @param {Object} socket
   */
  private connection = socket => {
    this.connectionId += 1;
    socket._connId = this.connectionId;

    socket.on('close', () => {
      delete this.connections[socket._connId];
    });

    this.connections[socket._connId] = socket;
  };

  /**
   * ### Log Start Messages
   */
  private logStartMessages = () => {
    // Startup & Shutdown messages
    const { URL, HOST, PORT } = CONSTANT_CONFIG.SERVER;
    const { ENV } = CONSTANT_CONFIG;
    if (process.env.NODE_ENV === 'production') {
      console.log(
        `Server is running in ${ENV} ...`.green,
        `\nIt's live on`,
        URL,
        `\nListening on`,
        `${HOST}:${PORT}`,
        `\nCtrl+C to shut down`.grey
      );
    } else {
      console.log(
        `Server is running in ${ENV} ...`.green,
        `\nListening on`,
        `${HOST}:${PORT}`,
        `\nUrl configured as:`,
        URL,
        `\nCtrl+C to shut down`.grey
      );
    }

    async function shutdown() {
      // clean-up the resources
      GlobalEventRegistry.emit('server.shutdown');

      console.log(`\nServer is shutting down.`.red);
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          `\nServer was running for`,
          moment.duration(process.uptime(), 'seconds').humanize()
        );
      }
      setTimeout(() => process.exit(0), 800);
    }

    // ensure that server exits correctly on Ctrl+C and SIGTERM
    process
      .removeAllListeners('SIGINT')
      .on('SIGINT', shutdown)
      .removeAllListeners('SIGTERM')
      .on('SIGTERM', shutdown);
  };

  /**
   * ### Log Shutdown Messages
   */
  private logShutdownMessages = () => {
    console.log('Server is closing connections'.red);
  };
}
