'use strict';

const { Model } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.hasMany(models.Portfolio, {
      //   foreignKey: 'userId'
      // });
    }

    static hashPassword(email, password) {
      return crypto.pbkdf2Sync(password, email, 310000, 32, 'sha256').toString('base64');
    }
  }

  User.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    hashedPassword: {
      allowNull: false,
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.VIRTUAL,
      set(value) {
        this.setDataValue('hashedPassword', User.hashPassword(value, this.email));
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
