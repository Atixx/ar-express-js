'use strict';

const bcrypt = require('bcrypt');
const errors = require('../errors');
const userService = require('../services/users');
const sessionManager = require('./../services/sessionManager');

exports.create = (req, res, next) => {
  const saltRounds = 10;

  const user = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email
      }
    : {};

  bcrypt
    .hash(user.password, saltRounds)
    .then(hash => {
      user.password = hash;

      userService
        .create(user)
        .then(u => {
          res.status(201);
          res.end();
        })
        .catch(err => {
          next(err);
        });
    })
    .catch(err => {
      next(errors.defaultError(err));
    });
};

exports.login = (req, res, next) => {
  const user = req.body
    ? {
        email: req.body.email,
        password: req.body.password
      }
    : {};

  userService.getByEmail(user.email).then(u => {
    if (u) {
      bcrypt.compare(user.password, u.password).then(isValid => {
        if (isValid) {
          const auth = sessionManager.encode({ username: u.username });

          res.status(200);
          res.set(sessionManager.HEADER_NAME, auth);
          res.send(u);
        } else {
          next(errors.invalidUser);
        }
      });
    } else {
      next(errors.invalidUser);
    }
  });
};
