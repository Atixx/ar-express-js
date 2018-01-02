const users = require('./controllers/users');
const sessions = require('./controllers/sessions');
const auth = require('./middlewares/auth');

exports.init = app => {
  app.post('/users', users.createReg);
  app.post('/users/sessions', users.login);
  app.post('/users/logout', auth.securePost, sessions.logout);
  app.post('/users/logout/all', auth.securePost, sessions.logoutAll);
  app.get('/users', auth.secureGet, users.list);
  app.post('/admin/users', auth.securePost, auth.admin, users.createAdmin);
};
