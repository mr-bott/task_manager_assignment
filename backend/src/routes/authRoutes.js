'use strict';

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const { protect } = require('../middlewares/authMiddleware');
const asyncWrapper = require('../utils/asyncWrapper');

router.post('/register', validateRegister, asyncWrapper(register));
router.post('/login', validateLogin, asyncWrapper(login));
router.get('/me', protect, asyncWrapper(getMe));

module.exports = router;
