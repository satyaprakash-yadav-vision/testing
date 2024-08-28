import requestIp from 'request-ip';
import { Request, Response, NextFunction } from 'express';

/**
 * This attached IP address on the request object
 */
export function findIp() {
  return function (req: Request, res: Response, next: NextFunction) {
    req['clientIp'] = requestIp.getClientIp(req);
    next();
  };
}
