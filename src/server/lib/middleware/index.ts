import { CorsMiddleware } from './cors';
import { requestId } from './request-id';
import { cacheControl } from './cache-control';
import { logRequest } from './log-request';
import { errorHandler } from './error-handler';
import { secureHeaders } from './secure-headers';
import { ReapUpload } from './reap-upload';
import { findIp } from './find-ip';

/**
 * Export all middlewares via middleware object
 */
export const middlewares = {
  requestId,
  findIp,
  logRequest,
  cacheControl,
  errorHandler,
  secureHeaders,
  reapUpload: ReapUpload,
  cors: CorsMiddleware.createCorsMiddleware
};
