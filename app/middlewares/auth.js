const sessionManager = require('./../services/sessionManager');
const orm = require('./../orm');
const errors = require('./../errors');
const sessionService = require('./../services/sessions');

exports.secure = (email, auth, req, res, next) => {
  try {
    if (sessionManager.decode(auth)) {
      req.email = email;
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
};

exports.securePost = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];
  const email = req.body.email;

  if (auth && email) {
    exports.secure(email, auth, req, res, next);
  } else {
    if (!auth) {
      next(errors.missingParameters(['token']));
    } else {
      next(errors.missingParameters(['email']));
    }
  }
};

exports.secureGet = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];
  const email = null;

  if (auth) {
    exports.secure(email, auth, req, res, next);
  } else {
    if (!auth) {
      next(errors.missingParameters(['token']));
    }
  }
};

exports.admin = (req, res, next) => {
  const email = req.body.email;

  orm.models.user.findOne({ where: { email } }).then(u => {
    if (u.admin) {
      req.email = email;
      next();
    } else {
      res.status(401);
      res.end();
    }
  });
};
