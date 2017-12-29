'use strict';

const bcrypt = require('bcrypt');
const errors = require('../errors');
const userService = require('../services/users');
const sessionManager = require('./../services/sessionManager');
const parametersManager = require('./../services/parametersManager');

const paramsCreate = ['firstname', 'lastname', 'password', 'email'];
const paramsLogin = ['password', 'email'];

exports.create = (req, res, next) => {
  const saltRounds = 10;
  const regexPassword = /^\w{8,}$/;
  const regexEmail = /.*@wolox.com.ar$/;

  parametersManager
    .check(paramsCreate, Object.keys(req.body))
    .then(() => {
      const user = req.body
        ? {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
            email: req.body.email
          }
        : {};

      if (!user.password.match(regexPassword)) {
        return next(errors.invalidPasswordFormat);
      }

      if (!user.email.match(regexEmail)) {
        return next(errors.invalidEmail);
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
          return next(errors.defaultError(err));
        });
    })
    .catch(error => {
      return next(errors.missingParameters(error));
    });
};

exports.login = (req, res, next) => {
  parametersManager
    .check(paramsLogin, Object.keys(req.body))
    .then(() => {
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

              res.status(201);
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
    })
    .catch(error => {
      return next(errors.missingParameters(error));
    });
};
