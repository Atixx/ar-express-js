'use strict';

const bcrypt = require('bcrypt');
const errors = require('../errors');
const userService = require('../services/users');
const sessionService = require('../services/sessions');
const sessionManager = require('./../services/sessionManager');
const parametersManager = require('./../services/parametersManager');

const paramsCreate = ['firstname', 'lastname', 'password', 'email'];
const paramsLogin = ['password', 'email'];

const saltRounds = 10;
const regexPassword = /^\w{8,}$/;
const regexEmail = /.*@wolox.com.ar$/;

exports.createUser = (user, res, next) => {
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

exports.createReg = (req, res, next) => {
  const missingParameters = parametersManager.check(paramsCreate, req.body);

  if (!missingParameters.length) {
    const user = req.body
      ? {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          password: req.body.password,
          email: req.body.email,
          admin: false
        }
      : {};

    if (!user.password.match(regexPassword)) {
      return next(errors.invalidPasswordFormat);
    }

    if (!user.email.match(regexEmail)) {
      return next(errors.invalidEmail);
    }

    return exports.createUser(user, res, next);
  } else {
    return next(errors.missingParameters(missingParameters));
  }
};

exports.createAdmin = (req, res, next) => {
  const missingParameters = parametersManager.check(paramsCreate, req.body);

  if (!missingParameters.length) {
    const user = req.body
      ? {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          password: req.body.password,
          email: req.body.email,
          admin: true
        }
      : {};

    if (!user.password.match(regexPassword)) {
      return next(errors.invalidPasswordFormat);
    }

    if (!user.email.match(regexEmail)) {
      return next(errors.invalidEmail);
    }

    return userService
      .updateAdmin(user.email)
      .then(() => {
        res.status(200);
        res.end();
      })
      .catch(() => {
        return exports.createUser(user, res, next);
      });
  } else {
    return next(errors.missingParameters(missingParameters));
  }
};

exports.login = (req, res, next) => {
  const missingParameters = parametersManager.check(paramsLogin, req.body);

  if (!missingParameters.length) {
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
  } else {
    return next(errors.missingParameters(missingParameters));
  }
};

exports.list = (req, res, next) => {
  return userService
    .getAll()
    .then(u => {
      res.status(200);
      res.send(u);
      res.end();
    })
    .catch(next);
};
