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

// Trust proxy for rate limiting and secure cookies (if behind a proxy)
app.set('trust proxy', 1);

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

// Favicon Route to prevent unnecessary 404 logs
app.get('/favicon.ico', (req, res) => res.status(204).end());

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
