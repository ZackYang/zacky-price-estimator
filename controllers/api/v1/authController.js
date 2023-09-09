'use strict';
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const db = require('../../../models');
const User = db.User;

const authenticatePassword = async (user, password) => {
  if (!user) { return false };

  if (bcrypt.compareSync(password, user.hashedPassword)) {
    return true;
  }

  return false;
}

const findUserByEmail = async email => {
  const user = await User.findOne({ where: { email: email } });
  return user;
}

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

exports.login =  asyncHandler(async (req, res, next) => {
  const user = await findUserByEmail(req.body.email);
    console.log(user);
    if (await authenticatePassword(user, req.body.password)) {
      return res.json(user);
    }

    res.status(401).json({ message: "Email or Password is incorrect." });
});

const logout = (req, res, next) => {

};
