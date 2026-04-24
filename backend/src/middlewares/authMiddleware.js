'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { sendResponse } = require('../utils/apiResponse');
const { User } = require('../models');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendResponse(res, 401, 'Not authorized to access this route. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return sendResponse(res, 401, 'The user belonging to this token no longer exists.');
    }

    req.user = user;
    next();
  } catch (err) {
    return sendResponse(res, 401, 'Not authorized to access this route. Invalid or expired token.');
  }
};

module.exports = { protect };
