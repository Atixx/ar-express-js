const Sequelize = require('sequelize'),
  config = require('./../config'),
  logger = require('./logger'),
  models = require('./models');

console.log(config.common.database.url);

exports.DB_URL = process.env.NODE_API_DB_URL || config.common.database.url; // eslint-disable-line max-len

exports.init = () => {
  const db = new Sequelize(exports.DB_URL, {
    logging: config.isDevelopment ? logger.info : false
  });
  models.define(db);
  exports.models = db.models;
  return config.isTesting ? Promise.resolve() : db.sync();
};
