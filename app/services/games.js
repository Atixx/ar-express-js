const orm = require('./../orm'),
  errors = require('../errors');

exports.create = game => {
  return orm.models.game.create(game).catch(err => {
    throw errors.savingError(err.errors);
  });
};

exports.getAll = (limit = 20, page = 0) => {
  return orm.models.game
    .findAll({
      order: [['id', 'ASC']],
      offset: limit * page,
      limit
    })
    .catch(err => {
      throw errors.databaseError(err.detail);
    });
};
