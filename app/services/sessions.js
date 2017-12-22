const orm = require('./../orm'),
  errors = require('../errors'),
  sessionManager = require('./sessionManager');

exports.create = session => {
  return orm.models.sessions.create(session).catch(err => {
    throw errors.savingError(err.errors);
  });
};

exports.isValid = (e, t) => {
  return orm.models.sessions
    .findOne({ where: { email: e, token: t } })
    .then(u => {
      sessionManager.decode(u.dataValues.token);
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

exports.delete = (e, t) => {
  return orm.models.sessions.destroy({ where: { email: e, token: t } }).catch(err => {
    throw errors.databaseError(err.detail);
  });
};
