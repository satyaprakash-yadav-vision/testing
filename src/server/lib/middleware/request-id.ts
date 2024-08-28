import * as uuid from 'uuid';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to assign Id to each request for internal usage
 */
export function requestId() {
  return function (req: Request, res: Response, next: NextFunction) {
    const requestId = req.get('X-Request-Id') || uuid.v4();

    // Set a value for internal use
    req.requestId = requestId;

    // If the header was set on the request, return it on the response
    if (req.get('X-Request-Id')) {
      res.set('X-Request-Id', requestId);
    }

    next();
  };
}
