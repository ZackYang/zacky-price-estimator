'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static saltRounds = 10;
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

    static hashPassword(password) {
      return bcrypt.hashSync(password, this.saltRounds);
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
        console.log(value)
        this.setDataValue('hashedPassword', User.hashPassword(value));
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
