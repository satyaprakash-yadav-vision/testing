import { Sequelize } from 'sequelize';
import { DB_CONN } from '../dbConnection';

export class BaseDAO {
  protected db: Sequelize;
  protected model;

  constructor(model) {
    this.db = DB_CONN;
    this.model = model;
  }

  public create(data: Object): Promise<any> {
    try {
      return this.db[this.model].create(data);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public bulkCreate(data: Object): Promise<any> {
    try {
      return this.db[this.model].bulkCreate(data);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public update(data: any, options: any): Promise<any> {
    try {
      return this.db[this.model].update(data, options);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public findOne(options: any): Promise<any> {
    try {
      return this.db[this.model].findOne(options);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public findAndCountAll(options: any): Promise<any> {
    try {
      return this.db[this.model].findAndCountAll(options);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public findAll(options: any): Promise<any> {
    try {
      return this.db[this.model].findAll(options);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public findByPk(id: number): Promise<any> {
    try {
      return this.db[this.model].findByPk(id);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public delete(where: any): Promise<any> {
    try {
      return this.db[this.model].destroy({ where, truncate: false });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public count(options: any): Promise<any> {
    try {
      return this.db[this.model].count(options);
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
