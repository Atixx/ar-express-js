'use strict';

const errors = require('../errors');
const gameService = require('../services/games');
const parametersManager = require('./../services/parametersManager');

const paramsCreate = ['name', 'code', 'score'];

exports.create = (req, res, next) => {
  const missingParameters = parametersManager.check(paramsCreate, req.body.game);

  if (missingParameters.length === 0) {
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
  } else {
    return next(errors.missingParameters(missingParameters));
  }
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
