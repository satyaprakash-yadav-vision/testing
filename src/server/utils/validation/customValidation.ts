import validator from 'validator';
import _ from 'lodash';

export const customValidation = {
  validateEmail: val => {
    return validator.isEmail(val) ? true : false;
  },

  validateMobile: val => {
    return validator.isMobilePhone(val, 'en-IN') ? true : false;
  },

  validateName: val => {
    return validator.isAlpha(val, 'en-US') ? true : false;
  },

  mobileRegexTest: val => {
    return new RegExp(/^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){6,15}[0-9]{1}$/).test(val);
  },

  randomNumber(length) {
    return Math.floor(
      Math.pow(10, length - 1) +
        Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
    );
  },

  formatAccountId(number) {
    const formatted = number.toString().padStart(9, '0'); // Pad with leading zeros to ensure 9 digits
    return `${formatted.slice(0, 3)}-${formatted.slice(3, 6)}-${formatted.slice(6)}`;
  },

  generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  
    return code;
  }
  
};