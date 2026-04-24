'use strict';

const { Task } = require('../models');
const { sendResponse } = require('../utils/apiResponse');

/**
 * @desc    Get all tasks for logged in user
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res) => {
  const { status, sort } = req.query;
  
  const query = {
    where: { userId: req.user.id },
    order: [['createdAt', sort === 'oldest' ? 'ASC' : 'DESC']]
  };

  if (status) {
    query.where.status = status;
  }

  const tasks = await Task.findAll(query);

  return sendResponse(res, 200, 'Tasks fetched successfully', tasks);
};

/**
 * @desc    Create a task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    status: status || 'Pending',
    dueDate,
    userId: req.user.id,
  });

  return sendResponse(res, 201, 'Task created successfully', task);
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res) => {
  const task = await Task.findOne({
    where: { id: req.params.id, userId: req.user.id }
  });

  if (!task) {
    return sendResponse(res, 404, 'Task not found');
  }

  const updatedTask = await task.update(req.body);

  return sendResponse(res, 200, 'Task updated successfully', updatedTask);
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res) => {
  const task = await Task.findOne({
    where: { id: req.params.id, userId: req.user.id }
  });

  if (!task) {
    return sendResponse(res, 404, 'Task not found');
  }

  await task.destroy();

  return sendResponse(res, 200, 'Task deleted successfully');
};

/**
 * @desc    Update task status
 * @route   PATCH /api/tasks/:id/status
 * @access  Private
 */
const updateTaskStatus = async (req, res) => {
  const { status } = req.body;

  const task = await Task.findOne({
    where: { id: req.params.id, userId: req.user.id }
  });

  if (!task) {
    return sendResponse(res, 404, 'Task not found');
  }

  task.status = status;
  await task.save();

  return sendResponse(res, 200, 'Task status updated successfully', task);
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
