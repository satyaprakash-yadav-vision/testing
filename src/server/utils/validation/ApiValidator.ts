import _ from 'lodash';
import { AnySchema, ValidationError, ValidationOptions } from 'joi';

import * as errors from '../../lib/errors';
// These represent the incoming data containers that we might need to validate
const containers = {
  query: {
    convert: true,
    allowUnknown: false,
    abortEarly: false
  },
  // For use with body-parser
  body: {
    convert: true,
    allowUnknown: true,
    abortEarly: false
  },
  headers: {
    convert: true,
    allowUnknown: true,
    stripUnknown: false,
    abortEarly: false
  },
  // URL params e.g "/users/:userId"
  params: {
    convert: true,
    allowUnknown: false,
    abortEarly: false
  }
};

export class ApiValidator {
  /**
   * Validate headers in the request
   * @param headers
   * @param schema
   * @param validationOptions
   */
  static async validateHeaders(
    headers: any,
    schema: AnySchema,
    validationOptions?: ValidationOptions
  ) {
    return ApiValidator.validateRequest(
      { schema, testData: headers, container: 'headers' },
      validationOptions
    );
  }

  /**
   * Validate query params in the request
   * @param query
   * @param schema
   * @param validationOptions
   */
  static async validateQuery(query: any, schema: AnySchema, validationOptions?: ValidationOptions) {
    return ApiValidator.validateRequest(
      { schema, testData: query, container: 'query' },
      validationOptions
    );
  }

  /**
   * Validate URL params in the request
   * @param urlParams
   * @param schema
   * @param validationOptions
   */
  static async validateParams(
    urlParams: any,
    schema: AnySchema,
    validationOptions?: ValidationOptions
  ) {
    return ApiValidator.validateRequest(
      { schema, testData: urlParams, container: 'params' },
      validationOptions
    );
  }

  /**
   * Validate body of the api request
   * @param body
   * @param schema
   * @param validationOptions
   */
  static async validateBody(body: any, schema: AnySchema, validationOptions?: ValidationOptions) {
    return ApiValidator.validateRequest(
      { schema, testData: body, container: 'body' },
      validationOptions
    );
  }

  /**
   * validate checks the current `Request` for validations
   * NOTE: mutates `request` in case the object is valid.
   * https://github.com/evanshortiss/express-joi-validation
   * @param param0
   * @param validationOptions
   */
  private static async validateRequest(
    {
      schema,
      testData,
      container
    }: {
      testData: Object;
      schema: AnySchema;
      container: 'headers' | 'query' | 'params' | 'body';
    },
    validationOptions?: ValidationOptions
  ) {
    try {
      const joiOptions = validationOptions ?? containers[container];
      const value = await schema.validateAsync(testData, joiOptions);
      _.assignIn(testData, value);
      return value;
    } catch (err) {
      const { details } = <ValidationError>err;
      console.log(details);
      if (!details) {
        // this means that invalid input was passed
        throw new errors.ValidationError({
          message: 'Failed to validate without schema.'
        });
      }

      let finalMessage: string;

      // Removed Code
      // if (container !== 'body') {
      //   finalMessage += `Error validating ${container}.`;
      // }

      // for (const errorDetail of details) {
      //   if (finalMessage.length > 0) {
      //     finalMessage += ' ';
      //   }
      //   finalMessage += `${errorDetail.message}.`;
      // }

      if (details.length > 0) finalMessage = details[0].context.label;

      const errorFields = _.flatMap(details, errorDetail => errorDetail.path);

      throw new errors.ValidationError({
        message: details[0]?.message || `The field ${finalMessage} is required`,
        errorDetails: {
          fields: errorFields
        }
      });
    }
  }
}
