import _ from 'lodash';
import * as uuid from 'uuid';

interface IErrorOptions {
  /**
   * Error message
   */
  message?: string;
  /**
   * Multiple error messages
   */
  messages?: Array<string>;
  /**
   * Unique Id for the error
   */
  id?: string;
  /**
   * Any help string/object for this error
   */
  help?: any;
  /**
   * Level of the error
   */
  level?: string;
  /**
   * Context for the error
   */
  context?: any;
  /**
   * Flag to decide if error stack should be hidden when logging or not
   */
  hideStack?: boolean;
  /**
   * Type of the error
   */
  errorType?: string;
  /**
   * HTTP status code of the error
   */
  statusCode?: number;
  /**
   * Any details about the error.
   * Details are logged along with the error so that it can be investigated.
   */
  errorDetails?: any;
  /**
   * Code for the error
   */
  code?: string;
  /**
   * Error object from which this error should be instantiated
   */
  err?: Error | ApplicationError;
}

/**
 * If you instantiate an error, it will try to set up all error properties based on your input.
 * CommonError's stick to the format of native errors + add's more custom attributes.
 */
export class ApplicationError extends Error {
  public id: string;

  public help?: any;

  public context?: any;

  public code?: string;

  public level?: string;

  public errorType: string;

  public statusCode: number;

  public errorDetails?: any;

  public hideStack?: boolean;

  public messages?: Array<string>;

  constructor(errOptions: IErrorOptions = {}) {
    super(errOptions.message);

    if (_.isString(errOptions)) {
      throw new Error(
        'Please instantiate Errors with the option pattern. e.g. new errors.CommonError({message: ...})'
      );
    }

    Error.captureStackTrace(this, ApplicationError);

    // assign defaults for the error
    this.id = errOptions.id ?? uuid.v1();
    this.help = errOptions.help ?? this.help;
    this.level = errOptions.level ?? 'normal';
    this.statusCode = errOptions.statusCode ?? 500;
    this.context = errOptions.context ?? this.context;

    this.code = errOptions.code;
    this.hideStack = errOptions.hideStack;
    this.errorDetails = errOptions.errorDetails;
    this.errorType = this.name = errOptions.errorType ?? 'InternalServerError';

    /**
     * Note: Error to inherit from, override!
     * Nested objects are getting copied over in one piece (can be changed, but not needed right now)
     * support err as string (it happens that third party libs return a string instead of an error instance)
     */
    const { err } = errOptions;
    if (err) {
      // set message if not already set
      if (!this.message && err.message) {
        this.message = err.message;
      }

      Object.getOwnPropertyNames(errOptions.err).forEach(property => {
        // original message is part of the stack, no need to pick it
        if (['errorType', 'name', 'message', 'statusCode'].includes(property)) {
          return;
        }

        // CASE: `code` should put options as priority over err
        if (property === 'code') {
          this[property] = this[property] || errOptions.err[property];
          return;
        }

        if (property === 'stack') {
          this[property] += `\n\n${errOptions.err[property]}`;
          return;
        }

        this[property] = errOptions.err[property] ?? this[property];
      });
    }

    this.message = (() => {
      if (this.message?.length > 0) {
        return this.message;
      }

      return 'The server has encountered an error.';
    })();
  }
}

export class IncorrectUsageError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super({
      statusCode: 400,
      level: 'critical',
      errorType: 'IncorrectUsageError',
      message: 'We detected a misuse. Please read the stack trace.',
      ...errOptions
    });
  }
}

export class InternalServerError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super(
      _.merge(
        {
          statusCode: 500,
          level: 'critical',
          errorType: 'InternalServerError',
          message: 'The server has encountered an error.'
        },
        errOptions
      )
    );
  }
}

export class NotFoundError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super(
      _.merge(
        {
          statusCode: 404,
          errorType: 'NotFoundError',
          message: 'Resource could not be found.'
        },
        errOptions
      )
    );
  }
}

export class BadRequestError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super(
      _.merge(
        {
          statusCode: 400,
          errorType: 'BadRequestError',
          message: 'The request could not be understood.'
        },
        errOptions
      )
    );
  }
}

export class VersionMismatchError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super(
      _.merge(
        {
          statusCode: 400,
          errorType: 'VersionMismatchError',
          message: 'Requested version does not match server version.'
        },
        errOptions
      )
    );
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super(
      _.merge(
        {
          statusCode: 401,
          errorType: 'UnauthorizedError',
          message: 'You are not authorized to make this request.'
        },
        errOptions
      )
    );
  }
}

export class NoPermissionError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super(
      _.merge(
        {
          statusCode: 403,
          errorType: 'NoPermissionError',
          message: 'You do not have permission to perform this request.'
        },
        errOptions
      )
    );
  }
}

export class TokenRevocationError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super(
      _.merge(
        {
          statusCode: 403,
          errorType: 'TokenRevocationError',
          message: 'Token is no longer available.'
        },
        errOptions
      )
    );
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super(
      _.merge(
        {
          statusCode: 403,
          errorType: 'ForbiddenError',
          message: `You don't have permission to make this request.`
        },
        errOptions
      )
    );
  }
}

export class ConflictError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super(
      _.merge(
        {
          statusCode: 409,
          errorType: 'ConflictError',
          message:
            'The request could not be completed due to a conflict with the current state of the target resource.'
        },
        errOptions
      )
    );
  }
}

export class UnsupportedMediaTypeError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super(
      _.merge(
        {
          statusCode: 415,
          errorType: 'UnsupportedMediaTypeError',
          message: 'The media in the request is not supported by the server.'
        },
        errOptions
      )
    );
  }
}

export class ValidationError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super(
      _.merge(
        {
          statusCode: 422,
          errorType: 'ValidationError',
          message: 'The request failed validation.'
        },
        errOptions
      )
    );
  }
}

export class GraphAPIError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super(
      _.merge(
        {
          statusCode: 422,
          errorType: 'GraphAPIError',
          message: 'Facebook Graph API returned an error.',
          errorDetails: errOptions.errorDetails
        },
        errOptions
      )
    );
  }
}

export class ResourceLockedError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super({
      statusCode: 423,
      errorType: 'ResourceLockedError',
      message: 'The resource is locked. Please try again after some time.',
      ...errOptions
    });
  }
}

export class TooManyRequestsError extends ApplicationError {
  /**
   * Number of seconds after which caller can retry the request
   */
  public retryAfterSeconds?: number;

  constructor(
    errOptions: IErrorOptions & {
      /**
       * Number of seconds after which caller can retry the request
       */
      retryAfterSeconds?: number;
    }
  ) {
    super({
      statusCode: 429,
      errorType: 'TooManyRequestsError',
      message: 'Server has received too many similar requests in a short space of time.',
      ...errOptions
    });
    this.retryAfterSeconds = Math.ceil(errOptions.retryAfterSeconds);
  }
}

export class FlowError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super({
      statusCode: 500,
      errorType: 'FlowError',
      message: 'There was an error in executing dialog flow.',
      ...errOptions
    });
  }
}

export class RoleError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super({
      statusCode: 500,
      errorType: 'RoleError',
      message: 'There was an error in checking role.',
      ...errOptions
    });
  }
}

export class TimeoutError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super({
      statusCode: 500,
      errorType: 'TimeoutError',
      message: 'Operation timed out.',
      ...errOptions
    });
  }
}

export class EmailError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super({
      statusCode: 500,
      errorType: 'EmailError',
      message: 'There was an error in sending email.',
      ...errOptions
    });
  }
}

export class MaintenanceError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super({
      statusCode: 503,
      errorType: 'MaintenanceError',
      message: 'The server is temporarily down for maintenance.',
      ...errOptions
    });
  }
}

export class MethodNotAllowedError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super({
      statusCode: 405,
      errorType: 'MethodNotAllowedError',
      message: 'Method not allowed for resource.',
      ...errOptions
    });
  }
}

export class RequestEntityTooLargeError extends ApplicationError {
  constructor(errOptions: IErrorOptions) {
    super({
      statusCode: 413,
      errorType: 'RequestEntityTooLargeError',
      message: 'Request was too big for the server to handle.',
      ...errOptions
    });
  }
}
