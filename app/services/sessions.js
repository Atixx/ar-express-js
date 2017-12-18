const orm = require('./../orm'),
  errors = require('../errors');

exports.create = session => {
  return orm.models.sessions.create(session).catch(err => {
    throw errors.savingError(err.errors);
  });
};
