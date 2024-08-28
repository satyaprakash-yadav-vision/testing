import os from 'os';
import _ from 'lodash';
import cors, { CorsOptions } from 'cors';
import { URL } from 'url';
import { pathToRegexp } from 'path-to-regexp';
import { Request, RequestHandler } from 'express';

/**
 * List of methods to be allowed for CORS
 */
const API_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

/**
 * Configuration options for disabling CORS for a request
 */
const DISABLE_CORS = {
  origin: false,
  methods: API_METHODS
};

/**
 * origins which are allowed to make CORS request
 */
const WHITELIST_ORIGIN = {
  /**
   * Allow ngrok for development purposes
   */
  development: [/^localhost$/, /^([a-z0-9]+[.])ngrok[.]io$/],
  staging: [/^localhost$/, /^([a-z0-9]+[.])ngrok[.]io$/],
  production: [/^localhost$/, /^([a-z0-9]+[.])ngrok[.]io$/]
};

/**
 * Gather a list of local ipv4 addresses
 */
const getIPs = () => {
  const iFaces = os.networkInterfaces();
  const ips = ['localhost'];

  Object.keys(iFaces).forEach(function (iFname) {
    iFaces[iFname].forEach(function (iface) {
      // only support IPv4
      if (iface.family !== 'IPv4') {
        return;
      }

      ips.push(iface.address);
    });
  });

  return ips;
};

/**
 * Configuration for CORS middleware
 */
interface ICorsOptions {
  /**
   * Configures the Access-Control-Allow-Credentials CORS header.
   * Set to true to pass the header, otherwise it is omitted.
   */
  withCredentials?: boolean;
  /**
   * If cors should be allowed for all scenarios
   */
  allowAlways?: boolean;
  /**
   * List of URLs for which CORS is always allowed
   */
  whitelist: string[];
  /**
   * Server URL on which CORS is being added
   */
  serverUrl: string;
  /**
   * Public routes on which CORS will be allowed
   */
  publicRoutes: string[];
}

export class CorsMiddleware {
  /**
   * whether we should configure cors to send credentials
   */
  withCredentials: boolean;

  /**
   * If cors should be allowed for all scenarios
   */
  allowAlways: boolean;

  /**
   * List of whitelisted URLs
   */
  whitelist: RegExp[];

  /**
   * List of internal URLs
   * CORS would always be allowed on requests from these URLs
   */
  private internalUrls: string[];

  /**
   * Base server URL
   * All requests for this URL are allowed for CORS
   */
  serverUrl: string;

  /**
   * CORS response options when it is allowed
   */
  corsAllowedResponse: CorsOptions;

  /**
   * Public routes have CORS enabled irrespective of the Origin
   */
  publicRoutes: RegExp[];

  constructor(corsOptions: ICorsOptions) {
    if (!corsOptions) {
      throw new Error('Options are required for CORS middleware.');
    }

    this.serverUrl = corsOptions.serverUrl;
    this.allowAlways = corsOptions.allowAlways ?? false;
    this.withCredentials = corsOptions.withCredentials ?? false;
    this.publicRoutes = _.map(corsOptions.publicRoutes, publicRoute => pathToRegexp(publicRoute));

    // Initialize whitelist
    this.initWhitelist(corsOptions);

    // CORS response options when it is allowed
    this.corsAllowedResponse = {
      origin: true,

      // Configures the Access-Control-Max-Age CORS header
      maxAge: 2 * 86400,

      // Configures the Access-Control-Allow-Methods CORS header
      methods: API_METHODS,

      // Configures the Access-Control-Allow-Credentials CORS header
      credentials: this.withCredentials
    };
  }

  /**
   * Creates a cors middleware
   * @param corsOptions
   */
  static createCorsMiddleware(corsOptions: ICorsOptions): RequestHandler {
    const corsMiddleware = new CorsMiddleware(corsOptions);
    return cors(corsMiddleware.handleCORS);
  }

  /**
   * Checks the origin and enables/disables CORS headers in the response.
   * @param req express request object.
   * @param callback  callback that configures CORS.
   */
  private handleCORS = (req: Request, callback): void => {
    const origin = req.get('origin');

    // allow cross origin if always allowed
    if (this.allowAlways) {
      return callback(null, this.corsAllowedResponse);
    }

    // Request must have an Origin header
    if (!origin) {
      return callback(null, DISABLE_CORS);
    }

    // get hostname from the origin header value
    const hostname = (() => {
      try {
        return new URL(origin).hostname;
      } catch (err) {
        return null;
      }
    })();

    // when origin header value matches internal URLs
    for (const internalUrl of this.internalUrls) {
      if (internalUrl == hostname) {
        // Allow CORS for whitelisted URLs
        return callback(null, this.corsAllowedResponse);
      }
    }

    // when origin header value matches our whitelist
    for (const whitelistedUrl of this.whitelist) {
      if (whitelistedUrl.test(hostname)) {
        // Allow CORS for whitelisted URLs
        return callback(null, this.corsAllowedResponse);
      }
    }

    // allow requests from all origins for open routes
    if (this.isOpenRouteRequest(req)) {
      return callback(null, this.corsAllowedResponse);
    }

    return callback(null, DISABLE_CORS);
  };

  /**
   * Check if the request is for a route which is open
   * @param req
   * @returns
   */
  private isOpenRouteRequest(req: Request) {
    const pathname = req.originalUrl;
    return _.some(this.publicRoutes, pathRegex => pathRegex.test(pathname));
  }

  /**
   * Initialize whitelist
   */
  private initWhitelist = (corsOptions: ICorsOptions) => {
    // Server environment
    const env = process.env.NODE_ENV || 'development';
    const allowedOrigins = WHITELIST_ORIGIN[env];
    const serverHostname = new URL(this.serverUrl).hostname;

    this.internalUrls = [
      // origins that always match: localhost, local IPs, etc.
      ...getIPs(),
      // Same URL is always trusted
      serverHostname
    ];

    const whiteUrls = [
      ...allowedOrigins,
      // Trusted urls from config
      ...corsOptions.whitelist
    ];

    this.whitelist = whiteUrls.map(whiteUrl => new RegExp(whiteUrl));
  };
}
