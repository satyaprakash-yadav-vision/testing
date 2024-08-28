import _ from 'lodash';
import Joi, { CustomHelpers } from 'joi';
import { StringUtils } from '../StringUtils';

/**
 * Regex for validating a template URL
 */
const TEMPLATE_REGEX = /{{([0-9a-zA-Z~!@#$%^&*()\-_=+;:,<>./?'`\s]+)}}/;

/**
 * Regex for matching template string anywhere within the text
 */
const TEMPLATE_CHECK_REGEX = new RegExp(TEMPLATE_REGEX, 'i');

interface TemplateSchema extends Joi.StringSchema {
  /**
   * Specifies whether template param check should be done or not
   * @param checkTemplate - Flag to enable/disable template param check
   */
  template(checkTemplate?: boolean): Joi.StringSchema;
}

interface IExtendedJoi extends Joi.Root {
  /**
   * Custom type to validate a full valid URL
   * or a partial URL which contains a template parameter
   */
  url(): TemplateSchema;

  /**
   * Validates phone number in 'e164' format
   */
  e164(): Joi.StringSchema;

  /**
   * Custom type for validating non-empty string
   */
  nonEmptyString(): Joi.StringSchema;

  /**
   * Joi type for validating optional string
   */
  optionalString(): Joi.StringSchema;
}

export const ExtendedJoi: IExtendedJoi = Joi.extend(
  {
    type: 'nonEmptyString',
    base: Joi.string().min(0).required()
  },
  {
    // Schema for optional string allowing empty string
    type: 'optionalString',
    base: Joi.string().empty('').allow(null)
  },
  {
    type: 'e164',
    base: Joi.string().regex(/^\+(?:[0-9] ?){6,14}[0-9]$/)
  },

  {
    type: 'url',
    base: Joi.string().empty(''),

    messages: {
      'url.plain': `'{{#value}}' is an invalid URL.`,
      'url.template': `'{{#value}}' is an invalid URL template.`
    },

    validate(value: string, helpers: CustomHelpers) {
      // A valid template url could be empty, a normal url or contain many template texts within
      const urlText = value?.trim();
      if (urlText?.length == 0 || StringUtils.isValidURL(urlText)) {
        return {
          value: urlText
        };
      }

      // This is done to ensure that validation doesn't fail if URL contains spaces
      if (StringUtils.isValidURL(encodeURI(urlText))) {
        return { value: urlText };
      }

      if (helpers.schema.$_getFlag('template')) {
        if (TEMPLATE_CHECK_REGEX.test(urlText)) {
          return { value: urlText };
        }
        return {
          value: urlText,
          errors: helpers.error('url.template')
        };
      }

      // Generate an error, state and options need to be passed
      return {
        value: urlText,
        errors: helpers.error('url.plain')
      };
    },

    rules: {
      template: {
        args: [
          {
            name: 'template',
            assert: _.isBoolean,
            message: 'must be a boolean'
          }
        ],
        method() {
          return this.$_setFlag('template', true);
        }
      }
    }
  }
);
