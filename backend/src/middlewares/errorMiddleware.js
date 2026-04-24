'use strict';

const logger = require('../utils/logger');
const { sendResponse } = require('../utils/apiResponse');

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const globalErrorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Something went wrong';
  let errors = {};

  // Log error
  logger.error(`${err.name}: ${message}\n${err.stack}`);

  // Handle Sequelize Validation Errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = 'Validation Error';
    err.errors.forEach((e) => {
      errors[e.path] = e.message;
    });
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  }

  // Handle Joi Validation Errors (Custom handling assuming Joi throws errors with isJoi flag or specific structure)
  if (err.isJoi) {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.details.map(detail => detail.message);
  }

  const responsePayload = {
    success: false,
    message,
  };

  if (Object.keys(errors).length > 0 || Array.isArray(errors) && errors.length > 0) {
    responsePayload.error = errors;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};
