'use strict';

const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required'
  }),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('Pending', 'In Progress', 'Completed').default('Pending'),
  dueDate: Joi.date().iso().allow(null).optional().messages({
    'date.format': 'Due date must be in ISO format'
  })
});

const updateTaskSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('Pending', 'In Progress', 'Completed').optional(),
  dueDate: Joi.date().iso().allow(null).optional().messages({
    'date.format': 'Due date must be in ISO format'
  })
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('Pending', 'In Progress', 'Completed').required().messages({
    'any.only': 'Status must be Pending, In Progress, or Completed',
    'any.required': 'Status is required'
  })
});

const validateCreateTask = (req, res, next) => {
  const { error } = createTaskSchema.validate(req.body, { abortEarly: false });
  if (error) return next(error);
  next();
};

const validateUpdateTask = (req, res, next) => {
  const { error } = updateTaskSchema.validate(req.body, { abortEarly: false });
  if (error) return next(error);
  next();
};

const validateUpdateStatus = (req, res, next) => {
  const { error } = updateStatusSchema.validate(req.body, { abortEarly: false });
  if (error) return next(error);
  next();
};

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  validateUpdateStatus
};
