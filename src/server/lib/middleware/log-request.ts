import * as uuid from 'uuid';
import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import _ from 'lodash';
import { EventLogger } from '../../utils/logger/EventLogger';
const logger = EventLogger.logger('APIExecutionRequest');
enum typeSeverity {
  critical = 'critical',
  high = 'high',
  normal = 'normal',
  low = 'low',
  chill = 'chill'
}

declare global {
  namespace Express {
    /**
     * Add additional properties on request object for logger purposes
     */
    interface Request {
      /**
       * Unique id of each request
       */
      requestId: string;
      /**
       * User id of the user performing the action/request
       */
      userId: string;
      /**
       * Error object in case of an error in processing the request
       */
      err: Error;
      /**
       * Details of token bearer
       */
      // @ts-ignore
      user: any;
    }
  }
}

/**
 * log request information in the standard logger
 * @param logger
 */
export function logRequest() {
  return function (req: Request, res: Response, next: NextFunction) {
    const startedAt = process.hrtime();
    const requestId = req.get('X-Request-Id') || uuid.v1();

    const transactionId = {
      transactionId: crypto.randomBytes(32).toString('hex'),
      nameAPI: req.originalUrl ?? req.baseUrl
    };
    const debugArg = {
      methodName: 'logRequest'
    };
    req['transactionId'] = transactionId;

    const logResponse = () => {
      const diff = process.hrtime(startedAt);
      // convert response time to millis
      const diffInMillis = diff[0] * 1e3 + diff[1] * 1e-6;
      const roundedTime = diffInMillis.toFixed(2);
      res['responseTime'] = `${roundedTime} ms`;
      req.requestId = requestId;
      req.userId = req.user ? req.user._id : null;

      const requestKeys = [
        `originalUrl`,
        `baseUrl`,
        `file`,
        `files`,
        `headers`,
        `params`,
        `query`,
        `clientIp`,
        `transactionId`,
        `body`,
        `requestId`,
        `userId`,
        `referrer`
      ];
      const options = {
        ..._.pick(req, requestKeys)
      };

      const responseKeys = [
        `outputData`,
        `outputSize`,
        `statusCode`,
        `responseTime`,
        `originalUrl`,
        `baseUrl`,
        `file`,
        `files`,
        `headers`,
        `params`,
        `query`,
        `clientIp`,
        `transactionId`,
        `body`,
        `requestId`,
        `userId`,
        `referrer`
      ];
      const resOptions = {
        ..._.pick(res, responseKeys)
      };
      const requestHearder: any = req.headers['content-length'];
      const requestSize = requestHearder/1024;
      if (requestSize > 500) {
        options.body = '** Size too Large ** ';
      }

      const responseHearderLength: any = res.get('content-length');
      const responseHearderSize = responseHearderLength/1024;
      if (responseHearderSize > 500) {
        resOptions['body'] = '** Size too Large ** ';
      }

      if (req.err) {
        logger.error(transactionId, debugArg, typeSeverity.critical, req.err.stack, {
          options,
          resOptions,
          err: req.err
        });
      } else {
        logger.debug(transactionId, debugArg, {
          options,
          resOptions
        });
      }

      res.removeListener('finish', logResponse);
      res.removeListener('close', logResponse);
    };

    res.on('finish', logResponse);
    res.on('close', logResponse);

    next();
  };
}
