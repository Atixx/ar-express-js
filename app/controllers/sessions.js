'use strict';

const errors = require('../errors');
const sessionService = require('../services/sessions');

exports.create = (req, res, next) => {
  const session = req.body
    ? {
        email: req.body.email,
        token: req.body.token
      }
    : {};

  return sessionService
    .create(session)
    .then(u => {
      res.status(201);
      res.end();
    })
    .catch(next);
};

exports.logout = (req, res, next) => {
  return sessionService
    .delete(req.headers.authorization)
    .then(() => {
      res.status(201);
      res.end();
    })
    .catch(next);
};

exports.logoutAll = (req, res, next) => {
  return sessionService
    .deleteAll(req.body.email)
    .then(() => {
      res.status(201);
      res.end();
    })
    .catch(next);
};
