'use strict';

const errors = require('../errors');
const matchService = require('../services/matches');

exports.create = (req, res, next) => {
  const match = req.body
    ? {
        user_id: req.body.match.user_id,
        game_id: req.params.game_id,
        hits: req.body.match.hits
      }
    : {};

  return matchService
    .create(match)
    .then(u => {
      res.status(201);
      res.end();
    })
    .catch(err => {
      next(errors.defaultError(err));
    });
};

exports.list = (req, res, next) => {
  return matchService
    .getAll()
    .then(u => {
      res.status(200);
      res.send(u);
      res.end();
    })
    .catch(err => {
      next(errors.defaultError(err));
    });
};
