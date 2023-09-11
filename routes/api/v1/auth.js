'use strict';
const express = require('express');
const router = express.Router();
const { checkSchema }  = require('express-validator');

const AuthController = require('../../../controllers/api/v1/authController')
const jwtAuthentication = require('../../../middleware/jwtAuthentication');
const db = require('../../../models');
const User = db.User;

const checkIfEmailInUse = async (email) => {
  const user = await User.findOne({where: { email: email}});
  if (user) {
    throw new Error('The Email is in use');
  }
};

/* GET home page. */
router.post(
  '/register',
  checkSchema({
    email: {
      trim: true,
      notEmpty: true,
      isEmail: true,
      emailNotInUse: {
        custom: checkIfEmailInUse
      }
    },
    password: {
      trim: true,
      escape: true,
      isStrongPassword: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      }
    },
    firstName: {
      trim: true,
      escape: true,
      notEmpty: true,
      isAlpha: true
    },
    lastName: {
      trim: true,
      escape: true,
      notEmpty: true,
      isAlpha: true
    }
  }),
  AuthController.register
);

router.post(
  '/login',
  checkSchema({
    email: {
      trim: true,
      notEmpty: true,
      isEmail: true
    },
    password: {
      trim: true,
      escape: true,
    }
  }),
  AuthController.login
)

router.delete(
  '/logout',
  jwtAuthentication,
  AuthController.logout
)

module.exports = router;
