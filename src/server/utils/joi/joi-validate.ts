import { APP_CONSTANT } from '../../../constants';
import { ExtendedJoi as joi } from '../../utils/validation';
import { MESSAGES } from '../constants/messages';

const nameRegex = new RegExp(/^[a-zA-Z\s]*$/i);
const { STRING_PATTERN, REQUIRED, ANY_ONLY } = APP_CONSTANT.JOI_VALIDATION_TYPE;

export const joiValidate = {
  userApi: {
    signIn: joi.object().keys({
      username: joi.string().trim().required(),
      password: joi.string().trim().required()
    }),
    registration: joi.object().keys({
      firstName: joi.string().trim().required(),
      lastName: joi.string().trim().required(),
      email: joi.string().trim().required().email().message(MESSAGES.ERROR.INVALID_EMAIL),
      phoneNo: joi.string().trim().required(),
      type: joi.string().trim().required().valid('company', 'partner', 'client'),
      cmpName: joi.when('type', {
        is: 'company',
        then: joi.string().trim().required(),
        otherwise: joi.string().trim().optional().allow(null)
      }),
      cmpAddress: joi.when('type', {
        is: 'company',
        then: joi.string().trim().required(),
        otherwise: joi.string().trim().optional().allow(null)
      }),
      cmpDirectName: joi.when('type', {
        is: 'company',
        then: joi.string().trim().required(),
        otherwise: joi.string().trim().optional().allow(null)
      }),
      cmpEmail: joi.when('type', {
        is: 'company',
        then: joi.string().trim().required().email().message(MESSAGES.ERROR.INVALID_EMAIL),
        otherwise: joi.string().trim().email().optional().allow(null)
      }),
      cmpRegistrationDate: joi.when('type', {
        is: 'company',
        then: joi.date().required(),
        otherwise: joi.string().trim().optional().allow(null)
      }),
      cmpCity: joi.when('type', {
        is: 'company',
        then: joi.string().trim().required(),
        otherwise: joi.string().trim().optional().allow(null)
      }),
      cmpStateId: joi.when('type', {
        is: 'company',
        then: joi.number().required(),
        otherwise: joi.number().optional().allow(null)
      }),
      cmpCountryId: joi.when('type', {
        is: 'company',
        then: joi.number().required(),
        otherwise: joi.number().optional().allow(null)
      }),
      cmpZipcode: joi.when('type', {
        is: 'company',
        then: joi.string().trim().required(),
        otherwise: joi.string().trim().optional().allow(null)
      })
    }),
    editProfile: joi.object().keys({
      userId: joi.number().required().integer(),
      companyId: joi.number().optional().integer().allow(null),
      firstName: joi.string().trim().required(),
      lastName: joi.string().trim().required(),
      email: joi.string().trim().required().email().message(MESSAGES.ERROR.INVALID_EMAIL),
      phoneNo: joi.string().trim().required(),
      cmpName: joi.when('companyId', {
        is: joi.any().valid(null),
        then: joi.string().trim().optional().allow(null),
        otherwise: joi.string().trim().required()
      })
    })
  },
  globalApi: {
    country: joi.object().keys({
      start: joi.number().optional().integer().min(1),
      limit: joi.number().min(1).optional().integer().min(1)
    }),
    stateById: joi.object().keys({
      countryId: joi.number().required().integer()
    }),
    cityById: joi.object().keys({
      stateId: joi.number().required().integer()
    })
  }
};
