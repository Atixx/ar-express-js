const orm = require('./../orm'),
  errors = require('../errors'),
  sessionManager = require('./sessionManager');

exports.create = session => {
  return orm.models.sessions.create(session).catch(err => {
    throw errors.savingError(err.errors);
  });
};

exports.existToken = t => {
  return orm.models.sessions
    .findOne({ where: { token: t } })
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

exports.delete = t => {
  return orm.models.sessions.destroy({ where: { token: t } }).catch(err => {
    throw errors.databaseError(err.detail);
  });
};

exports.deleteAll = e => {
  return orm.models.sessions.destroy({ where: { email: e } }).catch(err => {
    throw errors.databaseError(err.detail);
  });
};

exports.getOne = (e, t) => {
  return orm.models.sessions.findOne({ where: { email: t, token: t } }).catch(err => {
    throw errors.databaseError(err.detail);
  });
};

exports.getEmail = t => {
  return orm.models.sessions
    .findOne({ where: { token: t } })
    .then(s => s.email)
    .catch(err => {
      throw errors.databaseError(err.detail);
    });
};
