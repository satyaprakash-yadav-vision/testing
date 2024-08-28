import { BaseDAO } from './Base';
import { MODELS } from '../../constants';

export class UserMasterDao extends BaseDAO {
  constructor() {
    super(MODELS.t_user);
  }

  public createUser(params) {
    return this.create(params);
  }

  public updateUser(params, where:{where:{user_id:number,transaction?:any}}) {
    console.log(params,where);
    return this.update(params, { where: where });
  }

  public getUserByUsername(username) {
    const query = {
      attributes: [
        ['password', 'savedPassword'],
        ['user_id', 'id']
      ],
      where: {
        username: username,
        status: 'A'
      },
      raw: true
    };

    return this.findOne(query);
  }

  isValidAdmin(id) {
    const query = {
      where: {
        user_id: id,
        status: 'A'
      },
      raw: true
    };

    return this.findOne(query);
  }

  public userInfo(obj: { value: string; name: string }) {
    const query = {
      where: {
        [obj.name]: obj.value
      },
      raw: true
    };

    return this.findOne(query);
  }
  public getAllUser() {
    const query = {
      attributes: [
        ['user_id', 'id'],
        ['first_name','firstName'],
        ['last_name','lastName'],
      ],
      raw: true
    };

    return this.findAndCountAll(query);
  }
}
