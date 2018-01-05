const jwt = require('jwt-simple'),
  config = require('./../../config'),
  errors = require('./../errors');

const SECRET = config.common.session.secret;

exports.HEADER_NAME = config.common.session.header_name;

exports.encode = (toEncode, timeexp = 3600) => {
  return jwt.encode({ message: toEncode, exp: Date.now() / 1000 + parseFloat(timeexp) }, SECRET);
};

exports.decode = toDecode => {
  const decode = jwt.decode(toDecode, SECRET);
  return decode.message;
};
