const errors = require('./../errors');

exports.check = (modelParameters, reqParameters) => {
  const missingParameters = [];
  for (let i = 0; i < modelParameters.length; i++) {
    const param = modelParameters[i];
    if (!reqParameters.includes(param)) {
      missingParameters.push(param);
    }
  }
  return new Promise(function(fulfill, reject) {
    if (missingParameters.length !== 0) {
      reject(missingParameters);
    } else {
      fulfill();
    }
  });
};
