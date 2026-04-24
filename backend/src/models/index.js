'use strict';

const { sequelize } = require('../config/database');

const User = require('./User')(sequelize);
const Task = require('./Task')(sequelize);

// Define Relationships
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Task
};
