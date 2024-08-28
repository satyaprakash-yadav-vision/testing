import { Server } from 'http';
import { Application } from 'express';
import _ from 'lodash';
import { GlobalEventRegistry } from './index';
import { NodeUtils } from '../../utils/NodeUtils';

/**
 * Interface to be used if a functors needs arguments
 */
export interface IServerEventsArgs {
  baseHTTPServer?: Server;
  baseExpressApplication?: Application;

  [key: string]: any;
}

/**
 * Interface to be used to register a functor for the Server Level Events
 */
export interface IServerEvents {
  functor: (arg?: IServerEventsArgs) => any;
  args?: IServerEventsArgs;
}

export class ServerEvents {
  private static _serverEvent;

  /**
   * These two instance variables will contains functors which needs to be executed on the server start or the ned
   * events
   * @private
   */
  private onStartFunctors: IServerEvents[];

  private onEndFunctors: IServerEvents[];

  /**
   * Make a singleton class
   * @private
   */
  private constructor() {
    /**
     * Call backs on server started event
     */
    GlobalEventRegistry.on(
      'server.started',
      async (serverArgs: { baseHTTPServer: Server; baseExpressApplication: Application }) => {
        if (NodeUtils.isStrictEmpty(this.onStartFunctors)) {
          return;
        }

        await Promise.map(this.onStartFunctors, async ({ functor, args }) => {
          if (NodeUtils.isStrictEmpty(args)) {
            return await functor();
          }
          return await functor({
            baseHTTPServer: serverArgs.baseHTTPServer,
            baseExpressApplication: serverArgs.baseExpressApplication,
            ...args
          });
        });
      }
    );

    /**
     * Call backs on server started event
     */
    GlobalEventRegistry.on(
      'server.shutdown',
      async (serverArgs: { baseHTTPServer: Server; baseExpressApplication: Application }) => {
        if (NodeUtils.isStrictEmpty(this.onEndFunctors)) {
          return;
        }
        await Promise.map(this.onEndFunctors, async ({ functor, args }) => {
          if (NodeUtils.isStrictEmpty(args)) {
            return await functor();
          }
          return await functor({
            baseHTTPServer: serverArgs?.baseHTTPServer,
            baseExpressApplication: serverArgs?.baseExpressApplication,
            ...args
          });
        });
      }
    );
  }

  public static serverEvent() {
    if (!this._serverEvent) {
      this._serverEvent = new ServerEvents();
    }
    return this._serverEvent;
  }

  /**
   * Singleton method to register a function for onStart Event
   * @param functors
   */
  public onStart = (functors: IServerEvents[]) => {
    if (_.isEmpty(this.onStartFunctors)) {
      this.onStartFunctors = functors;
      return;
    }
    this.onStartFunctors.push(...functors);
  };

  /**
   * Singleton method to register a function for onExit Event
   * @param functors
   */
  public onExit = (functors: IServerEvents[]) => {
    if (_.isEmpty(this.onEndFunctors)) {
      this.onEndFunctors = functors;
      return;
    }
    this.onEndFunctors.push(...functors);
  };
}
