'use strict';

const errors = require('../errors');
const gameService = require('../services/games');

exports.create = (req, res, next) => {
  const game = req.body
    ? {
        name: req.body.game.name,
        code: req.body.game.code,
        score: req.body.game.score
      }
    : {};

  return gameService
    .create(game)
    .then(u => {
      res.status(201);
      res.end();
    })
    .catch(err => {
      next(errors.defaultError(err));
    });
};

exports.list = (req, res, next) => {
  return gameService
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
