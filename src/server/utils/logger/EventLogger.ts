import * as util from 'util';
import { EventEmitter } from 'events';
import { EvenLoggerRegistry } from '../../lib/events/EventLoggerRegistry';
import { CONSTANT_CONFIG } from '../../../config/CONSTANT_CONFIG';
import { IErrorLogDocument } from '../../lib/events/ILogDocument';
import { IDebugLogDocument } from '../../lib/events/ILogDocument';

const debugEmitter = new EventEmitter();
debugEmitter.setMaxListeners(120);
util.inspect.defaultOptions.colors = true;
util.inspect.defaultOptions.depth = null;

/**
 * Listener to send mail to all the recipient with Error Log payload
 *
 */
debugEmitter.on('mail', async (doc: IErrorLogDocument) => {});

/**
 * Listener for log event, it will make entry in the database
 *  and publish the log over the socket if the debug key is true
 */
const logHook = async (doc: IDebugLogDocument, isDiscreet) => {
  const {
    transactionId: { nameAPI }
  } = doc;
  /*  **************************
     Logging to mongodb disabled

     const model = DebugLogModel.getModel({ meta: doc.meta, isDiscreet });

     await model.AddLog(doc);
     if (!shouldDebugFlow) {
     }
     */
};

/**
 *  Listener for error event, it will make entry in the database,
 *  publish the log over the socket and emit event to send mail
 */
const errorHook = async (doc: IErrorLogDocument, isDiscreet) => {
  const {
    transactionId: { nameAPI }
  } = doc;

  /* *********
     * Logging to mongodb disabled

     const errorModel = ErrorLogModel.getModel({ meta: doc.meta, isDiscreet });

     // don't await just log
     errorModel.AddLog(doc);

     // mail it to the recipient
     debugEmitter.emit('mail', doc);
     */
};

const eventLogger = EvenLoggerRegistry.register({
  logHook,
  errorHook,
  appName: CONSTANT_CONFIG.SERVER.NAME
});

export class EventLogger {
  public static logger(useCaseName: string, discreet = false) {
    return eventLogger.logger({
      className: useCaseName,
      useCaseName,
      hookArgs: { logHookArgs: [discreet], errorHookArgs: [discreet] }
    });
  }
}
