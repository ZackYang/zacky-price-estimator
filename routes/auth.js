'use strict';
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const router = express.Router();
const crypto = require('crypto');
const { body, checkSchema, ExpressValidator }  = require('express-validator');

const AuthController = require('../controllers/authController')
const db = require('../models');
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

const verify = async (email, password, done) => {
  const user = await User.findOne({ where: { email: email } });
  if (!user) { return done(null, false, { message: 'Incorrect username or password.' }); }

  const hashedPassword = User.hashPassword(email, password);
  if (crypto.timingSafeEqual(Buffer.from(hashedPassword, 'base64'), Buffer.from(user.hashedPassword, 'base64'))) {
    return done(null, user);
  } else {
    return done(null, false, { message: 'Incorrect username or password.' });
  }
};

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    verify
  )
);

router.post(
  '/login',
  passport.authenticate('local'),
  (req, res) => {
    res.json({})
  }
)

module.exports = router;
