'use strict';

const errors = require('../errors');
const matchService = require('../services/matches');
const gameService = require('../services/games');
const parametersManager = require('./../services/parametersManager');

const paramsCreate = ['user_id', 'hits'];

exports.create = (req, res, next) => {
  const missingParameters = parametersManager.check(paramsCreate, req.body);

  if (!missingParameters.length) {
    const match = req.body
      ? {
          user_id: req.body.user_id,
          game_id: req.params.game_id,
          hits: req.body.hits
        }
      : {};

    return gameService
      .checkGame(match.game_id)
      .then(u => {
        if (u) {
          return matchService.create(match).then(v => {
            res.status(201);
            res.end();
          });
        } else {
          next(errors.defaultError(errors.notFound));
        }
      })
      .catch(err => {
        next(errors.defaultError(err));
      });
  } else {
    return next(errors.missingParameters(missingParameters));
  }
};

exports.list = (req, res, next) => {
  return matchService
    .getMatches(req.params.game_id)
    .then(u => {
      res.status(200);
      res.send(u);
      res.end();
    })
    .catch(err => {
      next(errors.defaultError(err));
    });
};
