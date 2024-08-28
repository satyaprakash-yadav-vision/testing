import _ from 'lodash';
import http from 'http';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { NextFunction, Request, Response } from 'express';

import { Json } from './typings';
import { ApplicationError, NotFoundError, TooManyRequestsError } from './errors';

export interface IRequestError extends ApplicationError {
  config?: AxiosRequestConfig;
  request?: any;
  response?: AxiosResponse<any>;
  isAxiosError?: boolean;
}

export class errorHandler {
  /**
   * Middleware for handling request errors in JSON format
   */
  static handleJSONResponse = [
    // Make sure the error can be served
    errorHandler.prepareError,
    // Render the error using JSON format
    errorHandler.JSONErrorRenderer
  ];

  /**
   * TODO - handle unknown resources & methods differently, so that we can also produce 405 Method Not Allowed
   * @param req
   * @param res
   * @param next
   */
  static resourceNotFound(req: Request, res: Response, next: NextFunction) {
    next(
      new NotFoundError({
        message: 'Resource not found.'
      })
    );
  }

  /**
   * Function to convert request error to JSON and send error response
   * @param err
   * @param req
   * @param res
   * @param next
   */
  static handleSyncError(
    err: Error | IRequestError,
    req: http.IncomingMessage,
    res: Response,
    next: NextFunction
  ) {
    errorHandler.prepareError(err, req, res, next);
    // Error is already transformed as per the required format in previous function calls
    errorHandler.JSONErrorRenderer(<IRequestError>err, req, res, next);
  }

  /**
   * Get an error ready to be shown the the user
   * @TODO: support multiple errors
   * @param err
   * @param req
   * @param res
   * @param next
   */
  private static prepareError(
    err: Error | IRequestError,
    req: http.IncomingMessage,
    res: Response,
    next: NextFunction
  ) {
    let requestErr = <IRequestError>err;
    /**
     * In case of a CommonError class, use it's data
     * Otherwise try to identify the type of error (mongoose validation, mongodb unique, ...)
     * If we can't identify it, respond with a generic 500 error
     */
    if (!(requestErr instanceof ApplicationError)) {
      const statusCode = (<ApplicationError>requestErr)?.statusCode;
      // We need a special case for 404 errors
      if (statusCode === 404) {
        requestErr = new NotFoundError({ err: requestErr });
      } else {
        requestErr = new ApplicationError({
          err: requestErr,
          statusCode
        });
      }
    }

    // Ensure that we have a valid HTTP status code value
    if (!requestErr || requestErr.statusCode >= 599) {
      requestErr = new ApplicationError({ err: requestErr });
    }

    /**
     * Update request details in case of axios error so that it appears in error log statement
     */
    if (requestErr.isAxiosError) {
      const res = requestErr.response;
      if (!requestErr.errorDetails) {
        requestErr.errorDetails = {};
      }
      _.assignIn(requestErr.errorDetails, {
        request: {
          url: res?.config?.url,
          method: res?.config?.method
        },
        response: res?.data
      });
    }

    // used for express logging middleware
    req.err = requestErr;

    // alternative for res.status();
    res.statusCode = requestErr.statusCode;

    // never cache errors
    res.set({
      'Cache-Control':
        'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
    });

    // set rate limit headers for `TooManyRequestsError`
    if (requestErr instanceof TooManyRequestsError) {
      const retryAfterHeaderValue = (<TooManyRequestsError>requestErr).retryAfterSeconds;
      res.set('retry-after', <any>retryAfterHeaderValue);
    }

    next(requestErr);
  }

  /**
   * Renders the request error to JSON response
   * @param err
   * @param req
   * @param res
   * @param next
   */
  private static JSONErrorRenderer(
    err: IRequestError & {
      errors?: Array<any>;
    },
    req: http.IncomingMessage,
    res: Response,
    next: NextFunction
  ) {
    // Create json response for the error
    const jsonError = <Json>{};

    if (!err.errors) {
      jsonError.errors = [
        {
          message: err.message,
          context: err.context,
          messages: err.messages,
          errorType: err.errorType
        }
      ];
    } else {
      /* Attach multiple errors to the response */
      // todo this case never comes up. fix this
      jsonError.errors = _.map(err.errors, (errorItem: any) => {
        return {
          message: errorItem.message,
          context: errorItem.context,
          messages: errorItem.messages,
          errorType: errorItem.errorType
        };
      });
    }

    res.json(jsonError);
  }
}
