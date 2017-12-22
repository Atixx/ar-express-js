exports.invalidUser = {
  statusCode: 400,
  message: 'Invalid email or password'
};

exports.invalidPasswordLength = {
  statusCode: 400,
  message: 'Password must have length >= 8'
};

exports.invalidPasswordFormat = {
  statusCode: 400,
  message: 'Password must be alphanumeric'
};

exports.notFound = {
  statusCode: 404,
  message: 'Not found'
};

exports.invalidToken = {
  statusCode: 400,
  message: 'Invalid Token'
};

exports.defaultError = message => {
  return {
    statusCode: 500,
    message
  };
};

exports.savingError = message => {
  return {
    statusCode: 400,
    message
  };
};

exports.databaseError = message => {
  return {
    statusCode: 503,
    message
  };
};
