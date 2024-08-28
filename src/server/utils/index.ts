import _ from 'lodash';
import moment from 'moment';
import { NodeUtils } from './NodeUtils';
import { config } from '../../config';

/**
 * Return a random int, used by `analyzer.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */
const getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export class GlobalUtils {
  /**
   * Timespans in seconds and milliseconds for better readability
   */
  static ONE_HOUR_S = 3600;

  static ONE_DAY_S = 86400;

  static ONE_YEAR_S = 31536000;

  static ONE_HOUR_MS = 3600000;

  static ONE_DAY_MS = 86400000;

  static ONE_WEEK_MS = 604800000;

  static ONE_MONTH_MS = 2628000000;

  static ONE_YEAR_MS = 31536000000;

  /**
   * Return a unique identifier with the given `len`.
   *
   *     analyzer.uid(10);
   *     // => "FDaS435D2z"
   *
   * @param {Number} len
   * @return {String}
   * @api private
   */
  static uid(len) {
    const buf = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charlen = chars.length;

    for (let idx = 1; idx < len; idx += 1) {
      buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
  }

  // The token is encoded URL safe by replacing '+' with '-', '\' with '_' and removing '='
  // NOTE: the token is not encoded using valid base64 anymore
  static encodeBase64URLsafe(base64String) {
    return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  // Decode url safe base64 encoding and add padding ('=')
  static decodeBase64URLsafe(base64String) {
    base64String = base64String.replace(/-/g, '+').replace(/_/g, '/');
    while (base64String.length % 4) {
      base64String += '=';
    }
    return base64String;
  }

  /**
   * Returns a random number between min (inclusive) and max (exclusive)
   * @param min
   * @param max
   * @return {number}
   */
  static getRandomBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  /**
   * Pick one random item from the array
   * @param array
   * @return {*}
   */
  static pickRandomItem(array) {
    const randIndex = utils.getRandomBetween(0, array.length);
    return array[randIndex];
  }

  /**
   * Read file type from the mime type
   * @param mimeType
   * @return {string|*}
   */
  static getTypeByMime(mimeType) {
    /* type of the content */
    let type;
    if (!NodeUtils.isNullOrUndefined(mimeType)) {
      const subparts = mimeType.split('/');
      if (subparts.length > 1) type = subparts[0];
    }
    /* use fallback folder in case of unrecognised mime type */
    if (NodeUtils.isNullOrUndefined(type)) type = 'generic';
    type = type.toLowerCase();

    return type;
  }

  // static removeOpenRedirectFromUrl = require("./remove-open-redirect-from-url");

  static isDev() {
    return config.get('env') === 'development';
  }

  static isProduction() {
    return config.get('env') === 'production';
  }

  static responseObject = () => {
    return {
      status: 200,
      success: true,
      detail: null,
      time: moment().format(),
      message: null
    };
  };
}

const utils = {
  /**
   * Timespans in seconds and milliseconds for better readability
   */
  ONE_HOUR_S: 3600,
  ONE_DAY_S: 86400,
  ONE_YEAR_S: 31536000,
  ONE_HOUR_MS: 3600000,
  ONE_DAY_MS: 86400000,
  ONE_WEEK_MS: 604800000,
  ONE_MONTH_MS: 2628000000,
  ONE_YEAR_MS: 31536000000,

  /**
   * Return a unique identifier with the given `len`.
   *
   *     analyzer.uid(10);
   *     // => "FDaS435D2z"
   *
   * @param {Number} len
   * @return {String}
   * @api private
   */
  uid(len) {
    const buf = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charlen = chars.length;

    for (let idx = 1; idx < len; idx += 1) {
      buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
  },

  // The token is encoded URL safe by replacing '+' with '-', '\' with '_' and removing '='
  // NOTE: the token is not encoded using valid base64 anymore
  encodeBase64URLsafe(base64String) {
    return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },

  // Decode url safe base64 encoding and add padding ('=')
  decodeBase64URLsafe(base64String) {
    base64String = base64String.replace(/-/g, '+').replace(/_/g, '/');
    while (base64String.length % 4) {
      base64String += '=';
    }
    return base64String;
  },

  /**
   * Returns a random number between min (inclusive) and max (exclusive)
   * @param min
   * @param max
   * @return {number}
   */
  getRandomBetween: (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  },

  /**
   * Pick one random item from the array
   * @param array
   * @return {*}
   */
  pickRandomItem: array => {
    const randIndex = utils.getRandomBetween(0, array.length);
    return array[randIndex];
  },

  /**
   * Read file type from the mime type
   * @param mimeType
   * @return {string|*}
   */
  getTypeByMime: mimeType => {
    /* type of the content */
    let type;
    if (!NodeUtils.isNullOrUndefined(mimeType)) {
      const subparts = mimeType.split('/');
      if (subparts.length > 1) type = subparts[0];
    }
    /* use fallback folder in case of unrecognised mime type */
    if (NodeUtils.isNullOrUndefined(type)) type = 'generic';
    type = type.toLowerCase();

    return type;
  },

  // removeOpenRedirectFromUrl: require("./remove-open-redirect-from-url"),

  isDev() {
    return config.get('env') === 'development';
  },

  isProduction() {
    return config.get('env') === 'production';
  }
};

export default utils;
