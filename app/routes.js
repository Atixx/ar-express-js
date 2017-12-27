const users = require('./controllers/users');
const sessions = require('./controllers/sessions');

exports.init = app => {
  app.post('/users', users.create);
  app.post('/users/sessions', users.login);
  app.post('/users/logout', sessions.logout);
  app.post('/users/logout/all', sessions.logoutAll);
  app.get('/users', users.list);
};
