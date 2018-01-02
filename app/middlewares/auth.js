const sessionManager = require('./../services/sessionManager');
const orm = require('./../orm');
const errors = require('./../errors');
const sessionService = require('./../services/sessions');

exports.secure = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];
  const email = req.body.email;

  if (auth && email) {
    try {
      if (sessionManager.decode(auth)) {
        req.email = email;
        next();
      } else {
        sessionService.delete(email, auth).then(() => {
          res.status(401);
          res.end();
        });
      }
    } catch (err) {
      sessionService.delete(email, auth).then(() => {
        res.status(401);
        res.end();
      });
    }
  } else {
    if (!auth) {
      next(errors.missingParameters(['token']));
    } else {
      next(errors.missingParameters(['email']));
    }
  }
};
