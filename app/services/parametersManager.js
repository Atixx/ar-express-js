const errors = require('./../errors');

exports.check = (modelParameters, reqBody) => {
  const reqParameters = Object.keys(reqBody);

  return modelParameters.reduce((missingParameters, param) => {
    if (!reqParameters.includes(param)) {
      missingParameters.push(param);
    }
    return missingParameters;
  }, []);
};
