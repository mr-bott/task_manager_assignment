'use strict';

/**
 * Wraps async route handlers to catch errors and pass them to next()
 * @param {Function} fn - Async express route handler
 * @returns {Function} Express route handler
 */
const asyncWrapper = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncWrapper;
