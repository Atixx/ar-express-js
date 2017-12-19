const orm = require('./../orm'),
  errors = require('../errors');

exports.create = session => {
  return orm.models.sessions.create(session).catch(err => {
    throw errors.savingError(err.errors);
  });
};

exports.isValid = (email, token) => {
  return orm.models.sessions.findOne({ where: token }).catch(err => {
    throw errors.invalidToken;
  });
};

exports.getCount = email => {
  return orm.models.sessions.count({ email }).catch(err => {
    throw errors.databaseError(err.message);
  });
};
