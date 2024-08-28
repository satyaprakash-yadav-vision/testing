import * as _ from 'lodash';
import { NodeUtils } from './NodeUtils';

const compare = (val1, val2, strict?: boolean) => {
  return strict ? val1 === val2 : val1 === val2;
};

export class ObjectUtils {
  /**
   *  Find the object value at the given property path
   * @param {object} argObject
   * @param {string[] | string} path
   * @return {any}
   */
  static getObjectAtPath = (argObject: Record<string, any>, path: string[] | string) => {
    if (_.isArray(path) && path.length === 0) return argObject;
    return _.result(argObject, path);
  };

  static upsertArray = (array: any[], matcher: any | Function, update: any) => {
    const result = _.find(array, matcher);

    if (result) {
      _.extend(result, update);
    } else {
      array.push(update);
    }

    // Array is already modified, but return it for convenience
    return array;
  };

  /**
   * Method to compare deep objects
   * @param obj1
   * @param obj2
   * @param strict
   * @returns {boolean}
   */
  static deepEqual = (obj1, obj2, strict): boolean => {
    let isEqual = true;

    const object1Keys = _.keys(obj1);
    const object2Keys = _.keys(obj2);

    let firstKeyAlias = object1Keys;
    let secondKeyAlias = object2Keys;

    let object1Alias = obj1;
    let object2Alias = obj2;

    if (object2Keys.length > object1Keys.length) {
      firstKeyAlias = object2Keys;
      secondKeyAlias = object1Keys;
      object1Alias = obj2;
      object2Alias = obj1;
    }

    const numItems = firstKeyAlias.length;
    for (let index = 0; index < numItems; index += 1) {
      const key = firstKeyAlias[index];
      if (strict && !compare(typeof object1Alias[key], typeof object2Alias[key], strict)) {
        isEqual = false;
        continue;
      }
      if (typeof object1Alias[key] === 'function') {
        if (!compare(object1Alias[key].toString(), object2Alias[key].toString(), strict)) {
          isEqual = false;
        }
        continue;
      }
      if (typeof object1Alias[key] === 'object') {
        if (object1Alias[key].length !== undefined) {
          // array
          let temp = object1Alias[key].slice(0);
          temp = temp.filter(function (el) {
            return object2Alias[key].indexOf(el) === -1;
          });
          if (temp.length > 0) {
            isEqual = false;
          }

          temp = object2Alias[key].slice(0);
          temp = temp.filter(function (el) {
            return object1Alias[key].indexOf(el) === -1;
          });
          if (temp.length > 0) {
            isEqual = false;
          }
          continue;
        }
        isEqual = isEqual && ObjectUtils.deepEqual(object1Alias[key], object2Alias[key], strict);
        continue;
      }
      // Simple types left so
      if (!compare(object1Alias[key], object2Alias[key], strict)) {
        isEqual = false;
      }
    }
    return isEqual;
  };

  /**
   * Omit keys from the passed object
   * @param value
   * @param keys
   * @return {any}
   */
  static omitDeep = (value, keys) => {
    if (NodeUtils.isNullOrUndefined(value)) {
      return {};
    }

    if (_.isArray(value)) {
      for (let index = 0; index < value.length; index += 1) {
        value[index] = ObjectUtils.omitDeep(value[index], keys);
      }
      return value;
    }

    if (!_.isObject(value)) {
      return value;
    }

    if (_.isString(keys)) {
      keys = [keys];
    }

    if (!_.isArray(keys)) {
      return value;
    }

    for (let index = 0; index < keys.length; index += 1) {
      _.unset(value, keys[index]);
    }

    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        value[key] = ObjectUtils.omitDeep(value[key], keys);
      }
    }

    return value;
  };

  /**
   * Delete all properties from the passed object except @props
   * @param object
   * @param props
   */
  static omitExcept = (object: any, props: string[]) => {
    const propsToKeep = ObjectUtils.makeArray(props);
    let objectKeys;

    // document might be a mongoose document in which case we need to convert it to object
    if (typeof object.toObject === `function`) objectKeys = _.keys(object.toJSON());
    else objectKeys = _.keys(object);

    for (const key of objectKeys) {
      if (!_.includes(propsToKeep, key)) delete object[key];
    }
  };

  /**
   * Wrap the given value in an array if not already
   * @param value
   * @return {any}
   */
  static makeArray = value => {
    if (NodeUtils.isNullOrUndefined(value)) return [];

    if (_.isArray(value)) return value;

    return [value];
  };

  /**
   * Clones an object by serializing it and then re-parsing it.
   * WARNING: Objects with circular dependencies will cause an error to be thrown.
   * @static
   * @method clone
   * @param {Object} object The object to clone
   * @return {Object} Cloned object
   */
  static clone = object => {
    return JSON.parse(JSON.stringify(object));
  };

  /**
   * Create compact version of the object
   * @param object
   */
  static compactObject = object => {
    _.forEach(object, (value, key) => {
      if (NodeUtils.isNullOrUndefined(value)) delete object[key];
    });
    return object;
  };

  /**
   * Renames a given property in object
   * @param object
   * @param {string} oldName
   * @param {string} newName
   * @return {any}
   */
  static renameProperty = (object, oldName: string, newName: string) => {
    // Do nothing if the names are the same
    if (oldName === newName) return object;

    // Check for the old property name to avoid a ReferenceError in strict mode.
    if (object.hasOwnProperty(oldName)) {
      object[newName] = object[oldName];
      delete object[oldName];
    }

    return object;
  };

  /**
   * Delete given properties from the object
   * @param object
   * @param {string[]} deleteProps
   * @return {any}
   */
  static deleteProps = (object: object, deleteProps: string[] = []) => {
    if (deleteProps.length === 0) return object;

    for (const prop of deleteProps) {
      ObjectUtils.removeAt(object, _.split(prop, `.`));
    }
  };

  /**
   * Check if raw string is a valid json
   * @param rawBody raw text or body to be checked for validity
   * @return {boolean}
   */
  static isValidJSON = rawBody => {
    if (_.isObject(rawBody) || _.isArray(rawBody)) return true;

    if (!_.isString(rawBody)) return false;

    try {
      JSON.parse(rawBody);
      return true;
    } catch (err) {
      return false;
    }
  };

  /**
   * Method to concert values of the object to lower case
   * Make sure the object is a object which have all values as string
   * @param object
   */
  static valueToLower = (object: { [key: string]: string }) => {
    return _.reduce(
      object,
      (acc, title, key) => {
        return { ...acc, [key]: title.toLowerCase() };
      },
      {}
    );
  };

  /**
   * Method to concert key of the object to lower case
   * Make sure the object is a object which have all values as string
   * @param object
   */
  static keyToLower = (object: { [key: string]: any }) => {
    return _.reduce(
      object,
      (acc, title, key) => {
        return { ...acc, [key.toLowerCase()]: title };
      },
      {}
    );
  };

  /**
   * Delete deep property from the object
   * @param object
   * @param {string[]} propertyPath
   */
  private static removeAt = (object, propertyPath: string[]) => {
    if (!object) return;

    if (propertyPath.length === 1) {
      delete object[propertyPath[0]];
      return;
    }

    const [prop] = propertyPath.splice(0, 1);
    ObjectUtils.removeAt(object[prop], propertyPath);
  };
}
