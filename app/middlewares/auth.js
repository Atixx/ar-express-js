const sessionManager = require('./../services/sessionManager');
const orm = require('./../orm');
const errors = require('./../errors');
const sessionService = require('./../services/sessions');
const userService = require('./../services/users');

exports.secure = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];
  if (auth) {
    try {
      if (sessionManager.decode(auth)) {
        next();
      } else {
        sessionService.delete(auth).then(() => {
          res.status(401);
          res.end();
        });
      }
    } catch (err) {
      sessionService.delete(auth).then(() => {
        res.status(401);
        res.end();
      });
    }
  } else {
    next(errors.missingParameters(['token']));
  }
};

exports.admin = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];

  return sessionService
    .getEmail(auth)
    .then(email => {
      userService.getByEmail(email).then(u => {
        if (u.admin) {
          req.email = email;
          next();
        } else {
          res.status(401);
          res.end();
        }
      });
    })
    .catch(next);
};
