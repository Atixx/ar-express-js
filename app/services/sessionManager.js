const jwt = require('jwt-simple'),
  config = require('./../../config');
const errors = require('./../errors');

const SECRET = config.common.session.secret;

exports.HEADER_NAME = config.common.session.header_name;

exports.encode = (toEncode, timeexp = 3600) => {
  return jwt.encode({ message: toEncode, exp: Date.now() / 1000 + timeexp }, SECRET);
};

exports.decode = toDecode => {
  const decode = jwt.decode(toDecode, SECRET);
  return decode.message;
};

// exports.decode = toDecode => {
//   return new Promise(function(fulfill, reject) {
//     try {
//       const decode = jwt.decode(toDecode, SECRET);
//       fulfill(decode.message);
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
