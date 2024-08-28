import { Model, DataTypes } from 'sequelize';
import { MODELS, TABLES } from '../../constants';
import { DB_CONN } from '../dbConnection';

export default class UserMasterModel extends Model {
  public user_id: number;
  public first_name: string;
  public last_name: string;
  public username: string;
  public password: string;
  public email_id: string;
  public status: string;
  public created_on: Date;
  public created_by: number;
  public update_on: Date;
  public updated_by: number;
}

UserMasterModel.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
   
    status: {
      type: DataTypes.ENUM('S', 'I', 'A'),
      allowNull: false,
      defaultValue: 'I'
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    update_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize: DB_CONN,
    modelName: MODELS.t_user,
    tableName: TABLES.t_user,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: 'update_on'
  }
);
