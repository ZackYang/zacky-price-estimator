'use strict';
const jwt = require('jsonwebtoken');
const process = require('process');

const db = require('../models');
const User = db.User;

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findOne({ where: { email: decodedToken['email'] } })

    if (user) {
      req.user = user;
      next();
    } else {
      throw 'Invalid user ID';
    }
  } catch {
    res.status(401).json({
      error: 'Invalid access token'
    });
  }
};