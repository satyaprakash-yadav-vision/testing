import { MESSAGES } from '../utils/constants/messages';
import {  userMasterDao } from '../../db/daos';

class UserService {
  
  async createUser(object, options) {
    const { firstName, lastName, username, password, emailId } = object;

    const data = {
      first_name: firstName,
      laste_name: lastName,
      status: 'A'
    };

    await userMasterDao.createUser(data);
    return { message: MESSAGES.SUCCESS.CREATED };
  }
  async updateUser(object, options) {
    const {id} = options.params;
    console.log(object);
    await userMasterDao.updateUser(object,{where:{user_id:id}});
    return { message: MESSAGES.SUCCESS.CREATED };
  }
  async getAllUser(object, options) {
    const companies = await userMasterDao.getAllUser();

    return { message: MESSAGES.SUCCESS.PROFILE, data: companies };
  }
}

export const userService = new UserService();
