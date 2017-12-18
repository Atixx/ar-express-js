const orm = require('./../orm'),
  errors = require('../errors');

exports.create = user => {
  return orm.models.user.create(user).catch(err => {
    throw errors.savingError(err.errors);
  });
};

exports.getByEmail = email => {
  return exports.getOne({ email });
};

exports.getOne = user => {
  return orm.models.user.findOne({ where: user }).catch(err => {
    throw errors.databaseError(err.detail);
  });
};

exports.isValidSession = (email, token) => {
  return orm.models.sessions.findOne({ where: email, token }).catch(err => {
    throw errors.invalidToken;
  });
};
