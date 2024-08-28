// eslint-disable-next-line max-classes-per-file
import debug from 'debug';
import _ from 'lodash';
import { CONSTANT_CONFIG } from '../../../config/CONSTANT_CONFIG';

import { ObjectUtils } from '../../utils/ObjectUtils';
import { AsyncUtils } from '../../utils/AsyncUtils';
import { debugType, IDebugLogDocument } from './ILogDocument';
import { IErrorLogDocument, typeSeverity } from './ILogDocument';
import { IDebugMeta, ILogMeta, ITransactionId } from './ILogDocument';

export interface IDebugArg {
  methodName: string;
}

type LogHook = (doc: IDebugLogDocument, ...args) => Promise<any>;
type ErrorHook = (doc: IErrorLogDocument, ...args) => Promise<any>;

interface IHookArgs {
  logHookArgs: any[];
  errorHookArgs: any[];
}

class EventLogger {
  public logHook: LogHook;

  public errorHook: ErrorHook;

  private hookArgs: IHookArgs;

  private className: string;

  private logMeta: ILogMeta;

  private fInfo: (...any: any) => any;

  private fVerbose: (...any: any) => any;

  private fDebug: (...any: any) => any;

  private fError: (...any: any) => any;

  constructor({
    className,
    logMeta,
    hookArgs
  }: {
    className: string;
    logMeta: ILogMeta;
    hookArgs: IHookArgs;
  }) {
    this.className = className;
    this.logMeta = logMeta;
    this.hookArgs = hookArgs;
    this.fInfo = debug(`${CONSTANT_CONFIG.SERVER.NAME}:${className}:info`);
    this.fVerbose = debug(`${CONSTANT_CONFIG.SERVER.NAME}:${className}:info:verbose`);
    this.fDebug = debug(`${CONSTANT_CONFIG.SERVER.NAME}:${className}:info:verbose:debug`);
    this.fError = console.error;
  }

  public info(transactionId: ITransactionId, debugArg: IDebugArg, ...args: any[]) {
    const debugMeta: IDebugMeta = {
      methodName: debugArg.methodName,
      className: this.className
    };
    const doc: IDebugLogDocument = {
      meta: this.logMeta,
      debugMeta,
      transactionId,
      data: args,
      debugType: debugType.info
    };
    this.log(this.fInfo, doc);
  }

  public verbose(transactionId: ITransactionId, debugArg: IDebugArg, ...args: any[]) {
    const debugMeta: IDebugMeta = {
      methodName: debugArg.methodName,
      className: this.className
    };
    const doc: IDebugLogDocument = {
      meta: this.logMeta,
      debugMeta,
      transactionId,
      data: args,
      debugType: debugType.verbose
    };
    this.log(this.fVerbose, doc);
  }

  public debug(transactionId: ITransactionId, debugArg: IDebugArg, ...args: any[]) {
    const debugMeta: IDebugMeta = {
      methodName: debugArg.methodName,
      className: this.className
    };
    const doc: IDebugLogDocument = {
      meta: this.logMeta,
      debugMeta,
      transactionId,
      data: args,
      debugType: debugType.debug
    };
    this.log(this.fDebug, doc);
  }

  public error(
    transactionId: ITransactionId,
    debugArg: IDebugArg,
    severity: typeSeverity = typeSeverity.critical,
    stackTrace: string,
    body: any
  ) {
    const debugMeta: IDebugMeta = {
      methodName: debugArg.methodName,
      className: this.className
    };
    const doc: IErrorLogDocument = {
      meta: this.logMeta,
      debugMeta,
      severity,
      body,
      transactionId,
      stackTrace: _.split(stackTrace, '\n')
    };

    this.fError('%O', doc);
    // asyncronously do the error log into the db, socket and send mail
    const docClone = ObjectUtils.clone(doc);
    AsyncUtils.executeOnNextTick(this.errorHook, docClone, ...this.hookArgs?.logHookArgs);
  }

  private log(type: (...any: any) => any, doc: IDebugLogDocument) {
    type('%O', doc);
    // asyncronously do the logging into the database and socket
    const docClone = ObjectUtils.clone(doc);
    AsyncUtils.executeOnNextTick(this.logHook, docClone, ...this.hookArgs?.errorHookArgs);
  }
}

export class EvenLoggerRegistry {
  private static _loggerApp: EvenLoggerRegistry;

  private appName: string;

  private logHook: LogHook;

  private errorHook: ErrorHook;

  private constructor({
    appName,
    logHook,
    errorHook
  }: {
    appName: string;
    logHook: LogHook;
    errorHook: ErrorHook;
  }) {
    this.appName = appName;
    this.logHook = logHook;
    this.errorHook = errorHook;
  }

  public static register = (args: { appName: string; logHook: LogHook; errorHook: ErrorHook }) => {
    if (!this._loggerApp) {
      this._loggerApp = new EvenLoggerRegistry(args);
    }
    return this._loggerApp;
  };

  public logger = ({
    className,
    useCaseName,
    hookArgs
  }: {
    className: string;
    useCaseName: string;
    hookArgs?: IHookArgs;
  }) => {
    const eventLogger = new EventLogger({
      className,
      logMeta: { appName: this.appName, useCaseName },
      hookArgs
    });
    eventLogger.logHook = this.logHook;
    eventLogger.errorHook = this.errorHook;
    return eventLogger;
  };
}
