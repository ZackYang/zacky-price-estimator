'use strict';
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');

const db = require('../models');
const User = db.User;

exports.register = asyncHandler(async (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const user = await User.create({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    });

    return res.send(`Hello, ${user.firstName}!`);
  }

  res.send({ errors: result.array() });
});

const login = (req, res, next) => {

};

const logout = (req, res, next) => {

};
