'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');
const { sendResponse } = require('../utils/apiResponse');
const logger = require('../utils/logger');

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    return sendResponse(res, 400, 'User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    logger.auth(`New user registered: ${user.email}`);
    return sendResponse(res, 201, 'User registered successfully', {
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    return sendResponse(res, 400, 'Invalid user data');
  }
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ where: { email } });

  if (user && (await user.matchPassword(password))) {
    logger.auth(`User logged in: ${user.email}`);
    return sendResponse(res, 200, 'Login successful', {
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    return sendResponse(res, 401, 'Invalid email or password');
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  return sendResponse(res, 200, 'User profile fetched successfully', {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
};

module.exports = {
  register,
  login,
  getMe,
};
