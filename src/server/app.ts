import express from 'express';
import compress from 'compression';
import * as bodyParser from 'body-parser';
import { middlewares } from './lib/middleware';
import { EventLogger } from './utils/logger/EventLogger';
import { config } from '../config';
import { ITransactionId } from './lib/events/ILogDocument';
import { setupAPIRouter } from './api/app';
import { IDebugArg } from './lib/events/EventLoggerRegistry';

const debug = EventLogger.logger('ServerApp');
/**
 * Maximum size of url-encoded body allowed
 */
const MAX_SIZE_URL_ENCODED_BODY = config.get('server:bodySize_API_urlencoded');

export class ServerApp {
  static init = async ({ transactionId }: { transactionId: ITransactionId }) => {
    const debugArg: IDebugArg = {
      methodName: 'init'
    };
    debug.info(transactionId, debugArg, 'Server App Setup Start');
    const parentApp = express();

    // Make sure 'req.secure' is valid for proxied requests
    parentApp.enable('trust proxy');

    // parse application/x-www-form-urlencoded
    parentApp.use(
      bodyParser.urlencoded({
        extended: true,
        limit: MAX_SIZE_URL_ENCODED_BODY,
        verify(req, res, buf) {
          req['rawBody'] = buf;
        }
      })
    );

    // parse text/xml as plain text
    parentApp.use(bodyParser.text({ type: 'text/xml' }));

    // request logging
    parentApp.use(middlewares.logRequest());

    // delete temporary files for file upload APIs
    parentApp.use(middlewares.reapUpload());

    // enabled gzip compression
    parentApp.use(compress());

    // Add headers secure middleware
    middlewares.secureHeaders(parentApp);

    // Configure default routes on the parent app
    // middlewares.setDefaultRoutes(parentApp);

    // find IP address of all incoming requests
    parentApp.use(middlewares.findIp());

    // mount api app
    const apiApp = await setupAPIRouter({ transactionId });
    parentApp.use('/api', apiApp);

    // debug.info(transactionId, debugArg, 'ParentApp setup end');

    // parentApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

    return parentApp;
  };
}
