'use strict';

const { Sequelize } = require('sequelize');
const config = require('./config');
const logger = require('../utils/logger');

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    logging: (msg) => logger.db(msg),
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: false,
      timestamps: true,
    },
  }
);

/**
 * Test the database connection
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info(' PostgreSQL connected successfully');

    // Sync models (use { force: true } to drop & recreate in dev)
    await sequelize.sync({ alter: true });
    logger.info(' Database synced successfully');
  } catch (error) {
    logger.error(' Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
