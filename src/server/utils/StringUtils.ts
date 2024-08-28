import * as _ from 'lodash';
import UriJs from 'uri-js';
import validator from 'validator';

import urlJoin from 'url-join';
import { NodeUtils } from './NodeUtils';

// regex for space
const spaceRE = /\s+/g;

// regex for punctuation marks
const punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;

/**
 * ASCII character codes that are non-printable
 */
const CONTROL_CHAR_CODES = [
  // <DEL>
  127, 129, 141, 143, 144, 157, 160, 173
];

export interface StringMap<T> {
  [key: string]: T;
}

export const StringUtils = {
  /**
   * Extracts group of digit from the given text
   * @param rawText
   */
  extractDigitsFromText(rawText: string) {
    const regexMatches = rawText.match(/\b[\d]+\b/);
    if (regexMatches && regexMatches[0]) {
      return regexMatches[0];
    }

    return null;
  },
  /**
   * Convert the text to upper case safely
   * @param {string} text
   * @return {string}
   */
  safeToUpperCase(text: string) {
    return text ? text.toString().toUpperCase() : ``;
  },

  /**
   * Joins different parts of the URL into a single URL
   * @param parts
   */
  joinUrl(...parts: string[]) {
    return urlJoin(parts);
  },

  /**
   * Perform case insensitive equality check between the given strings
   * @param {string} string1
   * @param {string} string2
   * @return {boolean}
   */
  isEqual(string1: string, string2: string) {
    return StringUtils.safeToUpperCase(string1) === StringUtils.safeToUpperCase(string2);
  },

  /**
   * Removes all control characters from the given text.
   * This does not remove line breaks from the text
   * @param text
   */
  removeControlCharacters(text: string) {
    if (!text || !_.isString(text)) return text;
    return text.replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, ``);
  },

  /**
   * Removes non printable characters from the given text.
   * This keeps on the ASCII range.
   * This will remove characters which aren't supported in English.
   *
   * @param text
   */
  removeNonEnglishChars(text: string): string {
    if (!text || !_.isString(text)) return text;
    return text.replace(/[^\x20-\x7E]+/g, ``);
  },

  /**
   * Formats the text used for defining intent titles/examples
   * @param text
   */
  formatNluExampleText(text: string): string {
    if (!text || !_.isString(text)) return text;

    return StringUtils.removeControlCharacters(text).replace(/\s+/g, ` `).trim();
  },

  /**
   * Perform case insensitive inequality check between the given strings
   * @param {string} string1
   * @param {string} string2
   * @return {boolean}
   */
  isNotEqual(string1: string, string2: string) {
    return !StringUtils.isEqual(string1, string2);
  },

  /**
   * Find out substring between the given strings
   * @param {string} str
   * @param {string} beginText
   * @param {string} finishText
   * @return {any}
   */
  substringBetween(str: string, beginText: string, finishText: string) {
    const rightHalf = str.substr(str.indexOf(beginText) + beginText.length);
    if (!rightHalf) return null;
    return rightHalf.substr(0, rightHalf.indexOf(finishText));
  },

  /**
   * Sanitize the passed url
   *
   * 1. Replaces multiple occurrence of slash into one
   * @param {string} url
   * @return {string}
   */
  sanitizeUrl(url: string) {
    return url.replace(/([^:]\/)\/+/g, '$1');
  },

  /**
   * Check if the passed string is empty one
   * @param {string} str
   * @return {boolean}
   */
  isEmptyString(str: string) {
    if (NodeUtils.isNullOrUndefined(str)) {
      return true;
    }
    const value = _.toString(str);
    return value.length === 0;
  },

  /**
   * Check if input can be a valid button text or not
   * @param {string} text
   * @return {boolean}
   */
  isButtonURL(text: string): boolean {
    if (StringUtils.isValidURL(text)) return true;

    // check for other schemes
    try {
      UriJs.parse(text);
      return true;
    } catch (err) {
      return false;
    }
  },

  /**
   * Check if the given url is valid or not.
   *
   * URL string should not be any falsy value
   * @param text
   * @param urlOptions
   * @return {boolean}
   */
  isValidURL(text: string, urlOptions?: validator.IsURLOptions) {
    if (NodeUtils.isNullOrUndefined(text)) return false;
    if (!_.isString(text)) return false;

    const defaultUrlOptions = {
      require_host: true,
      require_protocol: false,
      require_tld: false
    };
    urlOptions = urlOptions || defaultUrlOptions;
    return validator.isURL(text, urlOptions);
  },

  /**
   * Check if string contains given the given text
   * @param str
   * @param text
   */
  contains(str: string, text: string) {
    return StringUtils.safeToUpperCase(str).includes(StringUtils.safeToUpperCase(text));
  },

  /**
   * Check if string doesn't contain given string
   * @param str
   * @param text
   * @return {boolean}
   */
  notContains(str: string, text: string) {
    return !_.includes(str, text);
  },

  /**
   * Check if string is a slug
   * @param {string} slug
   * @return {boolean}
   */
  isSlug(slug: string) {
    return validator.matches(slug, /^[a-z0-9\-_]+$/);
  },

  /**
   * Normalize value of a parameter before saving
   * @param attribute
   * @return {any}
   */
  attributeToString(attribute: any) {
    if (NodeUtils.isNullOrUndefined(attribute)) return null;
    if (_.isString(attribute)) return attribute;
    // convert objects to json string
    if (_.isObject(attribute)) return JSON.stringify(attribute);

    return attribute.toString();
  },

  /**
   * Coerce the object to string
   * @param object
   * @return {string}
   */
  makeString(object: any) {
    if (object == null) return ``;
    return `${object}`;
  },

  /**
   * Convert string into words separated by underscore
   * @param {string} text
   * @return {string}
   */
  slugify(text: string) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  },

  /**
   * Check if the string starts with
   * @param {string} text
   * @param {string} searchString
   * @param {number} position
   * @return {boolean}
   */
  startsWith(text: string, searchString: string, position = 0) {
    return text.substr(position, searchString.length) === searchString;
  },

  /**
   * Strip any HTML
   * @param {string} text
   * @return {string}
   */
  stripTags(text: string) {
    return StringUtils.makeString(text).replace(/<\/?[^>]+>/g, ``);
  },

  /**
   * Return sentence array within the given text
   * @param text
   * @return {string[]}
   */
  getSentences(text): string[] {
    return text.replace(/([.?!])\s*(?=([A-Z0-9]|['"“”‘’]))/g, '$1|').split('|');
  },

  /**
   * Remove apostrophe from the passed text
   * @param {string} text
   * @return {string}
   */
  removeApostrophe(text: string): string {
    return text.replace(/'/g, ` `);
  },

  /**
   * Removes punctuations from the given string
   * @param {string} text
   * @return {string}
   */
  removePunctuations(text: string): string {
    return text.replace(punctRE, ``).replace(spaceRE, ` `);
  },

  /**
   * Removes all forward slashes from the given string
   * @param {string} text
   * @return {string}
   */
  givePaddingToForwardSlashes(text: string): string {
    return text.replace(/\//g, ` / `);
  },

  /**
   * Capitalize the first letter
   * @param {string} text
   * @return {string}
   */
  capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  /**
   * tokenize a sentence into array of words
   * @param {string} text
   * @return {string[]}
   */
  wordTokenize(text = ''): string[] {
    let sentence = text || '';

    // most punctuation
    sentence = sentence.replace(/([^\w.'\-\/+<>,&])/g, ' $1 ');

    // commas if followed by space
    sentence = sentence.replace(/(,\s)/g, ' $1');

    // single quotes if followed by a space
    sentence = sentence.replace(/('\s)/g, ' $1');

    // any quote if followed by a space
    // text = text.replace(/('\s)/g, " $1");

    // periods before newline or end of string
    sentence = sentence.replace(/\. *(\n|$)/g, ' . ');

    return _.without(sentence.split(/\s+/), '');
  },

  /**
   * Normalize white spaces
   * @param {string} inputText
   * @return {string}
   */
  normalizeWhiteSpaces(inputText: string) {
    return inputText.replace(/\s{2,}/g, ` `);
  },

  /**
   * Clean text of the url
   * @param {string} urlText
   * @return {string}
   */
  removeWhiteSpaces(urlText: string) {
    return urlText.replace(/\s+/g, ``);
  },

  /**
   * Check input text for digits only
   * @param {string} inputText
   * @return {boolean}
   */
  isDigit(inputText: string) {
    if (NodeUtils.isNullOrUndefined(inputText)) return false;
    if (!_.isString(inputText)) return false;

    return /^\d+$/.test(inputText);
  },

  /**
   * Replaces all occurences of keys in a string. Uses a string map to replace elements.
   *
   * @param {string} source
   * @param {StringMap<string>} replacements
   * @returns {string}
   */
  replaceInString(source: string, replacements: StringMap<string>): string {
    let output = source.slice();

    _.keys(replacements).forEach(replacementKey => {
      const regex = new RegExp(replacementKey, 'g');
      output = output.replace(regex, replacements[replacementKey]);
    });

    return output;
  },

  getNumbers: (inputText: string) => {
    if (NodeUtils.isNullOrUndefined(inputText)) {
      return false;
    }
    if (!_.isString(inputText)) {
      return false;
    }
    return inputText.match(/\d+/g);
  },

  /**
   * Convert an array or string containing array or comma separated string to an array
   * @param source
   */
  stringToArray(source: any): any {
    let destination = source;
    try {
      destination = JSON.parse(source) ?? source;
    } catch (err) {
      // not a proper json
    }

    // Comma separated list of envs to be converted to list of envs Ids
    if (_.isString(source) && _.includes(source, ',')) {
      destination = _.chain(source)
        .split(',')
        .map(element => element.replace(/"|'|\[|\]/g, '').trim())
        .value();
    }
    return destination;
  }
};
