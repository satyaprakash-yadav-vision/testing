import axios from 'axios';
import crypto from 'crypto';

import { EventLogger } from './EventLogger';
import { ITransactionId } from '../../lib/eventLogger/interfaces/ILogDocument';
import { CONSTANT_CONFIG } from '../../../config/CONSTANT_CONFIG';
import { IDebugArg } from '../../lib/eventLogger/EventLoggerRegistry';

// Number of nanoseconds per second
const NS_PER_SEC = 1e9;
// Number of nanoseconds per millisecond
const NS_PER_MS = 1e6;

const logger = EventLogger.logger('Axios', true);

export class AxiosLogger {
  static registerInterceptors = () => {
    axios.interceptors.request.use(request => {
      const { url, data, method, headers, params } = request;
      const transactionId: ITransactionId = {
        transactionId: crypto.randomBytes(32).toString('hex'),
        nameAPI: url
      };
      const debugArgs: IDebugArg = {
        methodName: 'request'
      };

      // set default header for user agent
      if (!headers['User-Agent']) {
        headers['User-Agent'] = CONSTANT_CONFIG.USER_AGENT;
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      request.meta = request.meta ?? {};

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore. Set start time for telemetry
      request.meta.startTime = process.hrtime();

      /**
       * Log request body only when the size is less than 500KB
       * This is done to ensure that log files don't become very big
       */
      const requestPayload = {
        url,
        data,
        params,
        method,
        headers
      };
      const requestSize = headers['content-length'] / 1024;
      if (requestSize > 500) {
        requestPayload.data = '** Size too Large ** ';
      }
      logger.debug(transactionId, debugArgs, {
        request: requestPayload,
        message: 'API call request ...'
      });

      return request;
    });

    axios.interceptors.response.use(response => {
      const { config, status, headers, statusText } = response;
      const transactionId: ITransactionId = {
        transactionId: crypto.randomBytes(32).toString('hex'),
        nameAPI: config.url
      };
      const debugArgs: IDebugArg = {
        methodName: 'response'
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const startTime = config.meta?.startTime;

      const [seconds, nanoseconds] = process.hrtime(startTime);
      const durationMs = Math.round((seconds * NS_PER_SEC + nanoseconds) / NS_PER_MS);

      const msgPayload: any = {
        request: {
          url: config.url,
          params: config.params,
          method: config.method,
          headers: config.headers
        },
        response: {
          statusCode: status,
          statusText
        },
        requestTimeMs: durationMs,
        message: 'API call response ...'
      };

      /**
       * Log response body only when the size is less than 500KB
       * This is done to ensure that log files don't become very big
       */
      const responseSizeInKb = headers['content-length'] / 1024;
      if (responseSizeInKb < 500) {
        msgPayload.response.body = response.data;
      }

      logger.debug(transactionId, debugArgs, msgPayload);

      return {
        ...response,
        timings: {
          response: durationMs
        }
      };
    });
  };
}
