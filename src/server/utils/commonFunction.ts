import moment from "moment-timezone";

export const commonFunction = {
  getCurrentDate: () => {
    return moment().tz('UTC').format('YYYY-MM-DD HH:mm:ss');
  },

  filterDataByKey: (key: string | number, data: Object[], removeKeyValues: string[]): Object[] => {
    return data.filter((attribute: []) => !removeKeyValues.includes(attribute[key]));
  },
  getDefaultChildDOB: () => {
    return moment().format('DD/MM/yyyy');
  },
  getChildDOBFormat: date => {
    return moment(date, 'DD-MM-YYYY').format('DD/MM/yyyy');
  },
  randomString: length => {
    let result = '';
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = length; i > 0; --i)
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    //let data = result.toLocaleLowerCase().toString();
    return result;
  },
  maskEmail: email => {
    const [name, domain] = email.split('@');
    const { length: len } = name;
    const maskedName = name[0] + '...' + name[len - 1];
    const maskedEmail = maskedName + '@' + domain;
    return maskedEmail;
  },
  maskPhoneNumber(phoneNumber, digitsToPreserve) {
    if (phoneNumber.length <= digitsToPreserve) {
      // If the phone number has fewer or equal digits than 'digitsToPreserve', return it as is.
      return phoneNumber;
    }

    const maskedDigits = '*'.repeat(phoneNumber.length - digitsToPreserve);
    const preservedDigits = phoneNumber.slice(-digitsToPreserve);

    return maskedDigits + preservedDigits;
  },
  getTemporaryUniquePass: () => {
    let password = Array(8)
      .fill('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
      .map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      })
      .join('');
    if (!/\d/.test(password)) {
      password = `${password}3`;
    }
    if (!password.match(/^[A-Z]*$/)) {
      // matches
      password = `${password}A`;
    }
    if (!password.match(/^[a-z]*$/)) {
      // matches
      password = `${password}a`;
    }
    return password;
  },
  convertKeysToCamelCase
};

function convertKeysToCamelCase(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
  
    if (Array.isArray(obj)) {
      return obj.map(item => convertKeysToCamelCase(item));
    }
  
    const convertedObj = {};
  
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const camelCaseKey = key.replace(/([-_]\w)|(^.)/g, (match, p1, p2) => {
          if (p1) {
            return p1.charAt(1).toUpperCase();
          } else {
            return p2.toLowerCase();
          }
        });
        convertedObj[camelCaseKey] = convertKeysToCamelCase(obj[key]);
      }
    }
  
    return convertedObj;
  }