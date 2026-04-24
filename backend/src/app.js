'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const routes = require('./routes');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorMiddleware');
const logger = require('./utils/logger');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Request with Morgan + Winston
const morganFormat = config.server.isDev ? 'dev' : 'combined';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

// API Routes
app.use('/api', routes);

// Base Route
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Task Manager API is running' });
});

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
