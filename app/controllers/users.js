'use strict';

const bcrypt = require('bcrypt');
const errors = require('../errors');
const userService = require('../services/users');
const sessionService = require('../services/sessions');
const sessionManager = require('./../services/sessionManager');
const isAlphaNumeric = require('validate.io-alphanumeric');

exports.create = (req, res, next) => {
  const saltRounds = 10;

  const user = req.body
    ? {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
        email: req.body.email
      }
    : {};

  if (!isAlphaNumeric(user.password)) {
    return next(errors.invalidPasswordFormat);
  }

  if (user.password.length < 8) {
    return next(errors.invalidPasswordLength);
  }

  bcrypt
    .hash(user.password, saltRounds)
    .then(hash => {
      user.password = hash;

      return userService.create(user).then(u => {
        res.status(201);
        res.end();
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
          const auth = sessionManager.encode(u.email, 0.5);

          const session = {
            email: u.email,
            token: auth
          };

          return sessionService
            .create(session)
            .then(() => {
              res.status(201);
              res.set(sessionManager.HEADER_NAME, auth);
              res.send(u);
            })
            .catch(errors.databaseError);
        } else {
          next(errors.invalidUser);
        }
      });
    } else {
      next(errors.invalidUser);
    }
  });
};
