interface JOI_VALIDATION_TYPE {
  ANY_ONLY: string;
  STRING_LENGTH: string;
  STRING_PATTERN: string;
  STRING_EMAIL: string;
  STRING_BASE: string;
  ARRAY_INCLUDE_REQUIRED: string;
  REQUIRED: string;
}

interface USER_TYPE_ID {
  PARTNER: number;
  COMPANY: number;
  CLIENT: number;
}

interface IAppConstant {
  JOI_VALIDATION_TYPE: JOI_VALIDATION_TYPE;
  USER_TYPE_ID: USER_TYPE_ID;
}

export const APP_CONSTANT: IAppConstant = Object.freeze({
  JOI_VALIDATION_TYPE: {
    ANY_ONLY: 'any.only',
    STRING_LENGTH: 'string.length',
    STRING_PATTERN: 'string.pattern.base',
    STRING_EMAIL: 'string.email',
    STRING_BASE: 'string.base',
    ARRAY_INCLUDE_REQUIRED: 'array.includesRequiredUnknowns',
    REQUIRED: 'any.required'
  },
  USER_TYPE_ID: {
    PARTNER: 2,
    COMPANY: 3,
    CLIENT: 4
  }
});
