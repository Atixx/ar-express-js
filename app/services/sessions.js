const orm = require('./../orm'),
  errors = require('../errors'),
  sessionManager = require('./sessionManager');

exports.create = session => {
  return orm.models.sessions.create(session).catch(err => {
    throw errors.savingError(err.errors);
  });
};

exports.existToken = token => {
  return orm.models.sessions
    .findOne({ where: { token } })
    .then(u => {
      return true;
    })
    .catch(err => {
      throw errors.invalidToken;
    });
};

exports.getCount = email => {
  return orm.models.sessions.count({ email }).catch(err => {
    throw errors.databaseError(err.message);
  });
};

exports.delete = token => {
  return orm.models.sessions.destroy({ where: { token } }).catch(err => {
    throw errors.databaseError(err.detail);
  });
};

exports.deleteAll = email => {
  return orm.models.sessions.destroy({ where: { email } }).catch(err => {
    throw errors.databaseError(err.detail);
  });
};

exports.getOne = (email, token) => {
  return orm.models.sessions.findOne({ where: { email, token } }).catch(err => {
    throw errors.databaseError(err.detail);
  });
};

exports.getEmail = token => {
  return orm.models.sessions
    .findOne({ where: { token } })
    .then(s => s.email)
    .catch(err => {
      throw errors.databaseError(err.detail);
    });
};
