'use strict';

const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require('../controllers/taskController');
const {
  validateCreateTask,
  validateUpdateTask,
  validateUpdateStatus
} = require('../validators/taskValidator');
const { protect } = require('../middlewares/authMiddleware');
const asyncWrapper = require('../utils/asyncWrapper');

// All task routes are protected
router.use(protect);

router.route('/')
  .get(asyncWrapper(getTasks))
  .post(validateCreateTask, asyncWrapper(createTask));

router.route('/:id')
  .put(validateUpdateTask, asyncWrapper(updateTask))
  .delete(asyncWrapper(deleteTask));

router.patch('/:id/status', validateUpdateStatus, asyncWrapper(updateTaskStatus));

module.exports = router;
