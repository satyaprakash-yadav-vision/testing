import helmet from 'helmet';
import nocache from 'nocache';
import { Request, Response, Express } from 'express';

type ExpressMiddlewareType = (req: Request, res: Response, next: () => void) => void;

/**
 * Secure the given app using headers
 * It does the following configurations -
 * - No cache
 * - DNS prefetch control
 * - Removes x-powered-by header
 * - Sets X-Download-Options for IE8+
 * - Sets "X-XSS-Protection: 1; mode=block".
 * @param expressApp
 */
export function secureHeaders(expressApp: Express) {
  expressApp.use(<ExpressMiddlewareType>nocache());

  // controls browser DNS prefetching
  expressApp.use(<ExpressMiddlewareType>helmet.dnsPrefetchControl({ allow: true }));

  // to prevent clickjacking
  expressApp.use(<ExpressMiddlewareType>helmet.frameguard({ action: 'deny' }));

  expressApp.use(<ExpressMiddlewareType>helmet.hidePoweredBy());

  // don't expose web server details
  expressApp.use((req, res, next) => {
    res.removeHeader('X-Powered-By');
    next();
  });

  // sets X-Download-Options for IE8+
  expressApp.use(<ExpressMiddlewareType>helmet.ieNoOpen());

  // Sets "X-XSS-Protection: 1; mode=block".
  expressApp.use(<ExpressMiddlewareType>helmet.xssFilter());
}
