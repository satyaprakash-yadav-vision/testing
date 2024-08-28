import * as _ from 'lodash';

export class NodeUtils {
  /**
   * Parse boolean from the string representation
   * @param {string} boolText
   * @param {boolean} defaultValue
   * @return {boolean}
   */
  static parseBoolean = (boolText: string | boolean, defaultValue = false) => {
    if (_.isBoolean(boolText)) return boolText as boolean;
    if (NodeUtils.isNullOrUndefined(boolText) || !_.isString(boolText)) return defaultValue;

    return (<string>boolText).toLowerCase() === `true`;
  };

  /**
   * Get value or default if null
   * @param value
   * @param defaultValue
   * @return {any}
   */
  static getValueOrDefault = (value: any, defaultValue: any) => {
    return NodeUtils.isNullOrUndefined(value) ? defaultValue : value;
  };

  /**
   * Tests if a value is NULL or undefined
   * @static
   * @method isNullOrUndefined
   * @param {*} value
   * @return {Boolean}
   */
  static isNullOrUndefined = value => {
    return _.isNull(value) || _.isUndefined(value);
  };

  /**
   * Check if the value is strictly empty
   * @param value
   * @return {boolean}
   */
  static isStrictEmpty = value => {
    if (_.isObject(value)) {
      // if all values in the object are null or undefined, it's treated as empty
      return !_.some(value, value => !NodeUtils.isNullOrUndefined(value));
    }
    return _.isEmpty(value);
  };

  /**
   * Check whether the path exist in the value,
   * If so then checks whether it is empty
   * @param value
   * @param path
   */
  static hasNonEmptyPath = (value, path: string) => {
    if (_.hasIn(value, path)) {
      return !NodeUtils.isStrictEmpty(_.get(value, path));
    }
    return false;
  };

  /**
   * Check if its a number
   * @param number
   * @return {boolean}
   */
  static isNumber = number => {
    return !isNaN(parseFloat(number)) && isFinite(number);
  };

  /**
   * Convert String Enumeration to Regex
   * @param enumT
   * @param flags
   * @param useKeys
   */
  static enumToRegex = ({
    enumT,
    flags,
    useKeys = true
  }: {
    enumT: Record<string, string>;
    flags?: string;
    useKeys?: boolean;
  }) => {
    if (flags) {
      if (useKeys) {
        return new RegExp(
          _.chain(enumT)
            .keys()
            .map(value => `^${value}$`)
            .join('|')
            .value(),
          flags
        );
      }
      return new RegExp(
        _.chain(enumT)
          .values()
          .map(value => `^${value}$`)
          .join('|')
          .value(),
        flags
      );
    }

    if (useKeys) {
      return new RegExp(
        _.chain(enumT)
          .keys()
          .map(value => `^${value}$`)
          .join('|')
          .value()
      );
    }

    return new RegExp(
      _.chain(enumT)
        .values()
        .map(value => `^${value}$`)
        .join('|')
        .value()
    );
  };

  /**
   * Convert String Enumeration to array of string
   * @param enumT
   * @param flags
   */
  static enumToArray = ({
    enumT,
    useKeys = true
  }: {
    enumT: Record<string, string>;
    useKeys?: boolean;
  }) => {
    if (useKeys) {
      return _.chain(enumT).keys().value();
    }
    return _.chain(enumT).values().value();
  };

  static enumKey = ({ enumT, value }: { enumT: Record<string, string>; value: string }) => {
    return _.chain(enumT)
      .invert()
      .find((element, key) => key === value)
      .value();
  };
}
