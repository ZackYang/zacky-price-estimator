'use strict';
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const process = require('process');

const db = require('../../../models');
const User = db.User;

const authenticatePassword = async (user, password) => {
  if (!user) { return false }

  if (bcrypt.compareSync(password, user.hashedPassword)) {
    return true;
  }

  return false;
}

const generateAccessToken = (email) => {
  return jwt.sign({ email }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
}

const findUserByEmail = async email => {
  const user = await User.findOne({ where: { email: email } });
  return user;
}

exports.register = asyncHandler(async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const user = await User.create({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      accessToken: generateAccessToken(req.body.email)
    });

    return res.send(`Hello, ${user.firstName}!`);
  }

  res.send({ errors: result.array() });
});

exports.login =  asyncHandler(async (req, res) => {
  const user = await findUserByEmail(req.body.email);
    if (await authenticatePassword(user, req.body.password)) {
      user.accessToken = generateAccessToken(req.body.email);
      await user.save();
      return res.status(200).json({ accessToken: user.accessToken });
    }

    res.status(401).json({ message: "Email or Password is incorrect." });
});

exports.logout = async (req, res) => {
  try {
    req.user.accessToken = null;
    await req.user.save();
    res.status(200).send();
  } catch(error) {
    res.status(401).json({
      error: error.message
    });
  }
};
