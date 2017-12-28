const users = require('./controllers/users');
const sessions = require('./controllers/sessions');
const games = require('./controllers/games');
const auth = require('./middlewares/auth');

exports.init = app => {
  app.post('/users', users.createReg);
  app.post('/users/sessions', users.login);
  app.post('/users/logout', auth.secure, sessions.logout);
  app.post('/users/logout/all', auth.secure, sessions.logoutAll);
  app.get('/users', auth.secure, users.list);
  app.post('/admin/users', auth.secure, auth.admin, users.createAdmin);
  app.post('/games', auth.secure, auth.admin, games.create);
  app.get('/games', auth.secure, games.list);
};
