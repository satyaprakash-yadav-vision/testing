import { userService } from '../../services/user.service';
import { GlobalUtils } from '../../utils';
import { joiValidate } from '../../utils/joi/joi-validate';
import { responses as ModifiedResponse } from '../../utils/responses';

const controller = {
  createUser: async (object, options) => {
    const response = GlobalUtils.responseObject();

    try {

      const userRes = await userService.createUser(object, options);

      return ModifiedResponse.sendSuccess(response, userRes);
    } catch (err) {
      return ModifiedResponse.sendFailure(response, { message: err.message });
    }
  },
  updateUser: async (object, options) => {
    const response = GlobalUtils.responseObject();

    try {

      const userRes = await userService.updateUser(object, options);

      return ModifiedResponse.sendSuccess(response, userRes);
    } catch (err) {
      return ModifiedResponse.sendFailure(response, { message: err.message });
    }
  },
  getAllUser: async (object, options) => {
    const response = GlobalUtils.responseObject();

    try {

      const userRes = await userService.getAllUser(object, options);

      return ModifiedResponse.sendSuccess(response, userRes);
    } catch (err) {
      return ModifiedResponse.sendFailure(response, { message: err.message });
    }
  },

};

export const userController = controller;
