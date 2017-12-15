// const controller = require('./controllers/controller');
const users = require('./controllers/users');

exports.init = app => {
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  app.post('/users', [], users.create);
  app.post('/users/sessions', [], users.login);
};
