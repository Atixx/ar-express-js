const sessionManager = require('./../services/sessionManager'),
  sessionService = require('./../services/sessions'),
  orm = require('./../orm');

exports.secure = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];

  if (auth) {
    sessionService
      .isValid(auth)
      .then(isvalid => next())
      .catch(err => {
        res.status(err.statusCode);
        res.end();
      });
  }
};
