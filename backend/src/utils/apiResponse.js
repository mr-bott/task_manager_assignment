'use strict';

/**
 * Standard API response helper
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Response message
 * @param {Object|Array} [data=null] - Response data
 */
const sendResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendResponse,
};
