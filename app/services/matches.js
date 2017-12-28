const orm = require('./../orm'),
  errors = require('../errors');

exports.create = match => {
  return orm.models.match.create(match).catch(err => {
    throw errors.savingError(err.errors);
  });
};

exports.getAll = (limit = 20, page = 0) => {
  return orm.models.match
    .findAll({
      order: [['id', 'ASC']],
      offset: limit * page,
      limit
    })
    .catch(err => {
      throw errors.databaseError(err.detail);
    });
};
