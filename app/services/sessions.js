const orm = require('./../orm'),
  errors = require('../errors'),
  sessionManager = require('./sessionManager');

exports.create = session => {
  return orm.models.sessions.create(session).catch(err => {
    throw errors.savingError(err.errors);
  });
};

exports.getCount = email => {
  return orm.models.sessions.count({ email }).catch(err => {
    throw errors.databaseError(err.message);
  });
};

exports.delete = (e, t) => {
  return orm.models.sessions.destroy({ where: { email: e, token: t } }).catch(err => {
    throw errors.databaseError(err.detail);
  });
};

exports.deleteAll = e => {
  return orm.models.sessions.destroy({ where: { email: e } }).catch(err => {
    throw errors.databaseError(err.detail);
  });
};
