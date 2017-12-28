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

exports.getAll = (limit = 20, page = 0) => {
  return orm.models.user
    .findAll({
      order: [['id', 'ASC']],
      offset: limit * page,
      limit
    })
    .catch(err => {
      throw errors.databaseError(err.detail);
    });
};

exports.updateAdmin = email => {
  return orm.models.user
    .findOne({ where: { email } })
    .then(u => {
      u
        .updateAttributes({
          admin: true
        })
        .then(() => {});
    })
    .catch(err => {
      throw errors.databaseError(err.detail);
    });
};
