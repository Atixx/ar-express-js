exports.invalidUser = {
  statusCode: 400,
  message: 'Invalid email or password'
};

exports.invalidPasswordFormat = {
  statusCode: 400,
  message: 'Password must be alphanumeric and must have a length > 8'
};

exports.invalidEmail = {
  statusCode: 400,
  message: 'Email must have the following domain: @wolox.com.ar'
};

exports.notFound = {
  statusCode: 404,
  message: 'Not found'
};

exports.defaultError = message => {
  return {
    statusCode: 400,
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
